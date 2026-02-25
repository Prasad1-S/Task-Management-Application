import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a0a0a;
          color: #fff;
          font-family: 'DM Mono', monospace;
          min-height: 100vh;
        }

        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        .nav {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 48px;
          border-bottom: 1px solid #111;
        }

        .logo {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-dot {
          width: 10px;
          height: 10px;
          background: #f5c842;
          border-radius: 50%;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link {
          font-size: 13px;
          color: #666;
          text-decoration: none;
          padding: 8px 16px;
          border: 1px solid transparent;
          transition: all 0.2s;
        }

        .nav-link:hover { color: #fff; border-color: #1a1a1a; }

        .nav-cta {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #0a0a0a;
          background: #f5c842;
          text-decoration: none;
          padding: 9px 20px;
          transition: all 0.2s;
        }

        .nav-cta:hover { background: #ffd95a; transform: translateY(-1px); }

        /* HERO */
        .hero {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 120px 48px 80px;
          text-align: center;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #f5c842;
          background: rgba(245,200,66,0.08);
          border: 1px solid rgba(245,200,66,0.15);
          padding: 6px 14px;
          margin-bottom: 36px;
          animation: fadeDown 0.6s ease both;
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(48px, 8vw, 80px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.03em;
          margin-bottom: 28px;
          animation: fadeUp 0.6s 0.1s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero h1 .accent { color: #f5c842; }

        .hero p {
          font-size: 16px;
          color: #555;
          max-width: 480px;
          margin: 0 auto 48px;
          line-height: 1.7;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .hero-btns {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          animation: fadeUp 0.6s 0.3s ease both;
        }

        .btn-primary {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #0a0a0a;
          background: #f5c842;
          text-decoration: none;
          padding: 14px 32px;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }

        .btn-primary:hover { background: #ffd95a; transform: translateY(-2px); }

        .btn-ghost {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          color: #666;
          background: none;
          text-decoration: none;
          border: 1px solid #1a1a1a;
          padding: 14px 32px;
          transition: all 0.2s;
        }

        .btn-ghost:hover { border-color: #333; color: #ccc; }

        /* FEATURES */
        .features {
          position: relative;
          z-index: 1;
          max-width: 1000px;
          margin: 0 auto;
          padding: 80px 48px;
          border-top: 1px solid #111;
        }

        .section-label {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #444;
          text-align: center;
          margin-bottom: 48px;
        }

        .feat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #111;
          border: 1px solid #111;
        }

        .feat-card {
          background: #0a0a0a;
          padding: 36px 32px;
          animation: fadeUp 0.5s ease both;
        }

        .feat-icon {
          width: 40px;
          height: 40px;
          border: 1px solid #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          margin-bottom: 20px;
          color: #f5c842;
        }

        .feat-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 10px;
        }

        .feat-desc {
          font-size: 13px;
          color: #444;
          line-height: 1.7;
        }

        /* DEMO PREVIEW */
        .preview-section {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 48px 100px;
        }

        .preview-box {
          background: #111;
          border: 1px solid #1a1a1a;
          padding: 32px;
          position: relative;
          overflow: hidden;
        }

        .preview-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #f5c842, transparent);
        }

        .preview-task {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #1a1a1a;
          animation: fadeUp 0.4s ease both;
        }

        .preview-task:last-child { border-bottom: none; }

        .p-check {
          width: 18px;
          height: 18px;
          border: 1px solid #333;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .p-check.done { background: #4ade80; border-color: #4ade80; }

        .p-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #ccc;
          flex: 1;
        }

        .p-title.done { text-decoration: line-through; color: #333; }

        .p-badge {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 8px;
          border: 1px solid;
        }

        .p-high { color: #ff5f5f; border-color: rgba(255,95,95,0.2); }
        .p-medium { color: #f5c842; border-color: rgba(245,200,66,0.2); }
        .p-low { color: #4ade80; border-color: rgba(74,222,128,0.2); }

        /* CTA */
        .cta-section {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 80px 48px;
          border-top: 1px solid #111;
        }

        .cta-section h2 {
          font-family: 'Syne', sans-serif;
          font-size: 40px;
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .cta-section p {
          font-size: 14px;
          color: #444;
          margin-bottom: 36px;
        }

        .footer {
          border-top: 1px solid #111;
          padding: 24px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }

        .footer-copy {
          font-size: 12px;
          color: #333;
        }

        .glow-hero {
          position: fixed;
          width: 800px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(245,200,66,0.05) 0%, transparent 70%);
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 0;
        }

        @media (max-width: 768px) {
          .nav { padding: 16px 24px; }
          .hero { padding: 80px 24px 60px; }
          .features { padding: 60px 24px; }
          .feat-grid { grid-template-columns: 1fr; }
          .preview-section { padding: 20px 24px 60px; }
          .cta-section { padding: 60px 24px; }
          .footer { flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>

      <div className="grid-bg" />
      <div className="glow-hero" />

      <nav className="nav">
        <Link href="/" className="logo">
          <span className="logo-dot" />
          TaskFlow
        </Link>
        <div className="nav-links">
          <Link href="/login" className="nav-link">Sign In</Link>
          <Link href="/register" className="nav-cta">Get Started</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-tag">
          <span>◆</span>
          Task Management, Simplified
        </div>
        <h1>
          Get things<br />
          <span className="accent">done.</span>
        </h1>
        <p>
          A fast, focused task manager built for individuals who need to stay on top of their work — with zero friction.
        </p>
        <div className="hero-btns">
          <Link href="/register" className="btn-primary">Start Free →</Link>
          <Link href="/login" className="btn-ghost">Sign In</Link>
        </div>
      </section>

      <section className="features">
        <div className="section-label">Why TaskFlow</div>
        <div className="feat-grid">
          <div className="feat-card" style={{ animationDelay: '0ms' }}>
            <div className="feat-icon">⚡</div>
            <div className="feat-title">Instant Actions</div>
            <div className="feat-desc">Create, update, and close tasks with minimal clicks. One-click status cycling keeps you in flow.</div>
          </div>
          <div className="feat-card" style={{ animationDelay: '80ms' }}>
            <div className="feat-icon">◎</div>
            <div className="feat-title">Priority System</div>
            <div className="feat-desc">Low, medium, and high priority labels help you focus on what matters most right now.</div>
          </div>
          <div className="feat-card" style={{ animationDelay: '160ms' }}>
            <div className="feat-icon">🔒</div>
            <div className="feat-title">Secure & Private</div>
            <div className="feat-desc">JWT authentication, bcrypt-hashed passwords, and HTTP-only cookies protect your account.</div>
          </div>
        </div>
      </section>

      <section className="preview-section">
        <div className="preview-box">
          {[
            { title: 'Design new landing page', priority: 'high', done: true },
            { title: 'Set up database migrations', priority: 'medium', done: false },
            { title: 'Write unit tests for API', priority: 'low', done: false },
            { title: 'Code review — auth module', priority: 'high', done: false },
          ].map((t, i) => (
            <div key={i} className="preview-task" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`p-check ${t.done ? 'done' : ''}`}>
                {t.done && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#0a0a0a" strokeWidth="2">
                    <path d="M1.5 5l2.5 2.5 4.5-4.5"/>
                  </svg>
                )}
              </div>
              <div className={`p-title ${t.done ? 'done' : ''}`}>{t.title}</div>
              <span className={`p-badge p-${t.priority}`}>{t.priority}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to ship?</h2>
        <p>Create a free account and start organizing your work today.</p>
        <Link href="/register" className="btn-primary">Create Account →</Link>
      </section>

      <footer className="footer">
        <div className="footer-copy">© {new Date().getFullYear()} TaskFlow. All rights reserved.</div>
        <div className="footer-copy">Built with Next.js</div>
      </footer>
    </>
  );
}