import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const kv = Redis.fromEnv();

function checkAuth(request) {
  const auth = request.headers.get('authorization');
  if (!auth) return false;
  const pw = auth.replace('Bearer ', '');
  return pw === process.env.ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'pending';

  try {
    const ids = await kv.lrange(`submissions:${status}`, 0, 200) || [];
    const submissions = [];
    for (const id of ids) {
      const data = await kv.hgetall(`submission:${id}`);
      if (data && data.id) submissions.push(data);
    }
    submissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return NextResponse.json({ submissions });
  } catch (err) {
    console.error('Admin GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id, action } = await request.json();
    if (!id || !['approve', 'reject', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const sub = await kv.hgetall(`submission:${id}`);
    if (!sub || !sub.id) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const oldStatus = sub.status;

    if (action === 'delete') {
      await kv.lrem(`submissions:${oldStatus}`, 0, id);
      await kv.lrem('submissions:all', 0, id);
      await kv.del(`submission:${id}`);
      return NextResponse.json({ success: true, message: 'Deleted' });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    await kv.hset(`submission:${id}`, { status: newStatus });
    await kv.lrem(`submissions:${oldStatus}`, 0, id);
    await kv.lpush(`submissions:${newStatus}`, id);

    return NextResponse.json({ success: true, message: `Submission ${newStatus}` });
  } catch (err) {
    console.error('Admin POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
