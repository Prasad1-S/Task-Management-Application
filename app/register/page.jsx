'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .page {
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Mono', monospace;
          position: relative;
          overflow: hidden;
        }

        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .glow {
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,200,66,0.06) 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
          pointer-events: none;
        }

        .card {
          position: relative;
          width: 100%;
          max-width: 440px;
          margin: 24px;
          background: #111;
          border: 1px solid #222;
          padding: 48px 40px;
          animation: fadeUp 0.5s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #f5c842, transparent);
        }

        .badge {
          display: inline-block;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #f5c842;
          background: rgba(245,200,66,0.1);
          border: 1px solid rgba(245,200,66,0.2);
          padding: 4px 10px;
          margin-bottom: 24px;
        }

        h1 {
          font-family: 'Syne', sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 13px;
          color: #555;
          margin-bottom: 36px;
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .field { margin-bottom: 18px; }

        label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 8px;
        }

        input {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid #222;
          color: #fff;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          padding: 12px 16px;
          outline: none;
          transition: border-color 0.2s;
        }

        input:focus { border-color: #f5c842; }
        input::placeholder { color: #333; }

        .strength-bar {
          height: 2px;
          background: #1a1a1a;
          margin-top: 8px;
          position: relative;
        }

        .strength-fill {
          height: 100%;
          transition: width 0.3s, background 0.3s;
        }

        .error-msg {
          font-size: 12px;
          color: #ff5f5f;
          background: rgba(255,95,95,0.08);
          border: 1px solid rgba(255,95,95,0.2);
          padding: 10px 14px;
          margin-bottom: 20px;
        }

        button[type="submit"] {
          width: 100%;
          background: #f5c842;
          color: #0a0a0a;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: none;
          padding: 14px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
        }

        button[type="submit"]:hover:not(:disabled) {
          background: #ffd95a;
          transform: translateY(-1px);
        }

        button[type="submit"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .footer-link {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: #444;
        }

        .footer-link a {
          color: #f5c842;
          text-decoration: none;
        }

        .footer-link a:hover { opacity: 0.7; }

        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0,0,0,0.3);
          border-top-color: #0a0a0a;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .terms {
          font-size: 11px;
          color: #444;
          text-align: center;
          margin-top: 16px;
          line-height: 1.6;
        }
      `}</style>

      <div className="page">
        <div className="grid-bg" />
        <div className="glow" />
        <div className="card">
          <div className="badge">Task Manager</div>
          <h1>Create account</h1>
          <p className="subtitle">Start managing your tasks today</p>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-msg">{error}</div>}

            <div className="field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                autoComplete="name"
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div className="row">
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${Math.min(100, form.password.length * 10)}%`,
                      background: form.password.length < 4 ? '#ff5f5f' : form.password.length < 8 ? '#f5c842' : '#4ade80',
                    }}
                  />
                </div>
              </div>
              <div className="field">
                <label>Confirm</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  required
                  autoComplete="new-password"
                  style={{ borderColor: form.confirm && form.password !== form.confirm ? '#ff5f5f' : '' }}
                />
              </div>
            </div>

            <button type="submit" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="terms">By creating an account, you agree to our terms of service.</p>

          <div className="footer-link">
            Already have an account? <Link href="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}