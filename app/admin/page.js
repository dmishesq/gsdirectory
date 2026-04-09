'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('pending');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchSubs = useCallback(async (status) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin?status=${status}`, {
        headers: { Authorization: `Bearer ${password}` }
      });
      if (res.status === 401) { setAuthed(false); return; }
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch { setSubmissions([]); }
    setLoading(false);
  }, [password]);

  useEffect(() => {
    if (authed) fetchSubs(tab);
  }, [authed, tab, fetchSubs]);

  async function doAction(id, action) {
    setMsg('');
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
        body: JSON.stringify({ id, action })
      });
      const data = await res.json();
      setMsg(data.message || 'Done');
      fetchSubs(tab);
    } catch { setMsg('Error'); }
  }

  function handleLogin(e) {
    e.preventDefault();
    setAuthed(true);
  }

  if (!authed) {
    return (
      <div style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 15, marginBottom: 12 }}
          />
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  const tabs = ['pending', 'approved', 'rejected'];
  const btnStyle = (action) => ({
    padding: '4px 12px', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer',
    background: action === 'approve' ? '#22c55e' : action === 'reject' ? '#ef4444' : '#6b7280',
    color: '#fff', marginRight: 6
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Submissions Admin</h1>
        <Link href="/" style={{ color: '#2563eb', fontSize: 14 }}>← Directory</Link>
      </div>

      {msg && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: 10, marginBottom: 16, fontSize: 14 }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: '8px 20px', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              background: tab === t ? '#2563eb' : '#f1f5f9', color: tab === t ? '#fff' : '#475569'
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      ) : submissions.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No {tab} submissions.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {submissions.map(sub => (
            <div key={sub.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{sub.name}</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                    <a href={sub.website} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>{sub.website}</a>
                    {' · '}{sub.category}{sub.city ? ` · ${sub.city}` : ''}{sub.state ? `, ${sub.state}` : ''}
                    {sub.phone ? ` · ${sub.phone}` : ''}
                  </div>
                  <div style={{ fontSize: 14, marginTop: 8, color: '#334155' }}>{sub.description}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
                    Score: {sub.score} · {new Date(sub.createdAt).toLocaleDateString()} · IP: {sub.ip}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {tab !== 'approved' && <button style={btnStyle('approve')} onClick={() => doAction(sub.id, 'approve')}>Approve</button>}
                  {tab !== 'rejected' && <button style={btnStyle('reject')} onClick={() => doAction(sub.id, 'reject')}>Reject</button>}
                  <button style={btnStyle('delete')} onClick={() => { if (confirm('Delete permanently?')) doAction(sub.id, 'delete'); }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
