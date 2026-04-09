'use client';

import { useState } from 'react';
import { categories } from '../../data/directory';
import Link from 'next/link';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC'
];

export default function SubmitPage() {
  const [form, setForm] = useState({
    name: '', website: '', category: '', phone: '', city: '', state: '', description: ''
  });
  const [status, setStatus] = useState(null); // null | 'submitting' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const categoryNames = [...new Set((categories || []).map(c => c.name))].sort();

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Submission received.');
        setForm({ name: '', website: '', category: '', phone: '', city: '', state: '', description: '' });
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px' }}>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'none', fontSize: 14 }}>
        ← Back to Directory
      </Link>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>
        Submit Your Listing
      </h1>
      <p style={{ color: '#64748b', marginBottom: 32, fontSize: 15 }}>
        Add your business to our professional services directory. Submissions are reviewed before publishing.
      </p>

      {status === 'success' ? (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 24, textAlign: 'center' }}>
          <p style={{ color: '#166534', fontWeight: 600, fontSize: 16 }}>{message}</p>
          <button
            onClick={() => setStatus(null)}
            style={{ marginTop: 16, padding: '8px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Submit Another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <label>
              <span style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 4 }}>Business Name *</span>
              <input
                type="text" required value={form.name} onChange={e => update('name', e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15 }}
              />
            </label>

            <label>
              <span style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 4 }}>Website URL *</span>
              <input
                type="url" required placeholder="https://example.com" value={form.website} onChange={e => update('website', e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15 }}
              />
            </label>

            <label>
              <span style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 4 }}>Category *</span>
              <select
                required value={form.category} onChange={e => update('category', e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15, background: '#fff' }}
              >
                <option value="">Select a category</option>
                {categoryNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </label>

            <label>
              <span style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 4 }}>Phone</span>
              <input
                type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15 }}
              />
            </label>

            <div style={{ display: 'flex', gap: 12 }}>
              <label style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 4 }}>City</span>
                <input
                  type="text" value={form.city} onChange={e => update('city', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15 }}
                />
              </label>
              <label style={{ width: 100 }}>
                <span style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 4 }}>State</span>
                <select
                  value={form.state} onChange={e => update('state', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15, background: '#fff' }}
                >
                  <option value="">--</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            </div>

            <label>
              <span style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: 4 }}>Description *</span>
              <textarea
                required rows={4} maxLength={500} value={form.description} onChange={e => update('description', e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15, resize: 'vertical' }}
              />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{form.description.length}/500</span>
            </label>

            {status === 'error' && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: 12, color: '#991b1b', fontSize: 14 }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              style={{
                padding: '12px 24px', background: status === 'submitting' ? '#93c5fd' : '#2563eb',
                color: '#fff', border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 600,
                cursor: status === 'submitting' ? 'not-allowed' : 'pointer'
              }}
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Listing'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
