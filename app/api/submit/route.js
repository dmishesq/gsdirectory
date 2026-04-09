import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const kv = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

function sanitize(str) {
  if (!str) return '';
  return String(str).replace(/<[^>]*>/g, '').trim().slice(0, 500);
}

function isValidUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch { return false; }
}

async function checkRateLimit(ip) {
  const key = `ratelimit:${ip}`;
  const count = await kv.incr(key);
  if (count === 1) await kv.expire(key, 3600);
  return count <= 5;
}

async function spamScore(submission) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return 80; // no key = auto-approve
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 20,
        messages: [
          {
            role: 'system',
            content: 'You are a spam detector for a professional services directory focused on tax, legal, financial, and business services. Rate the submission 0-100 where 100=clearly legitimate, 0=obvious spam. Respond with ONLY a number.'
          },
          {
            role: 'user',
            content: `Name: ${submission.name}\nWebsite: ${submission.website}\nCategory: ${submission.category}\nCity: ${submission.city}\nState: ${submission.state}\nDescription: ${submission.description}`
          }
        ]
      })
    });
    const data = await res.json();
    const score = parseInt(data.choices?.[0]?.message?.content?.trim(), 10);
    return isNaN(score) ? 50 : Math.max(0, Math.min(100, score));
  } catch {
    return 50;
  }
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { name, website, category, phone, city, state, description } = body;

    // Validate required fields
    if (!name || !website || !category || !description) {
      return NextResponse.json({ error: 'Name, website, category, and description are required.' }, { status: 400 });
    }
    if (!isValidUrl(website)) {
      return NextResponse.json({ error: 'Please enter a valid URL starting with http:// or https://' }, { status: 400 });
    }

    const submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: sanitize(name),
      website: website.trim().slice(0, 200),
      category: sanitize(category),
      phone: sanitize(phone || ''),
      city: sanitize(city || ''),
      state: sanitize(state || ''),
      description: sanitize(description),
      ip,
      createdAt: new Date().toISOString(),
      status: 'pending',
      score: 0
    };

    // Spam scoring
    submission.score = await spamScore(submission);
    if (submission.score >= 71) {
      submission.status = 'approved';
    } else if (submission.score <= 30) {
      submission.status = 'rejected';
    } else {
      submission.status = 'pending';
    }

    // Store in Redis
    await kv.hset(`submission:${submission.id}`, submission);
    await kv.lpush(`submissions:${submission.status}`, submission.id);
    await kv.lpush('submissions:all', submission.id);

    return NextResponse.json({
      success: true,
      message: submission.status === 'approved'
        ? 'Your listing has been approved and will appear shortly.'
        : 'Your submission has been received and is under review.',
      status: submission.status
    });
  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
