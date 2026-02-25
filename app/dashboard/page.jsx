'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['todo', 'in_progress', 'done'];
const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };
const PRIORITY_COLORS = { low: '#4ade80', medium: '#f5c842', high: '#ff5f5f' };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState({ status: 'all', priority: 'all', search: '' });
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'todo', due_date: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const [userRes, tasksRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/tasks'),
      ]);
      if (!userRes.ok) { router.push('/login'); return; }
      const userData = await userRes.json();
      const tasksData = await tasksRes.json();
      setUser(userData.user || userData);
      setTasks(Array.isArray(tasksData) ? tasksData : tasksData.tasks || []);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditingTask(null);
    setForm({ title: '', description: '', priority: 'medium', status: 'todo', due_date: '' });
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setForm({ title: task.title, description: task.description || '', priority: task.priority, status: task.status, due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '' });
    setModalOpen(true);
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (diffDays < 0) return { label: 'Overdue · ' + formatted, color: '#ff5f5f' };
    if (diffDays === 0) return { label: 'Due today', color: '#f5c842' };
    if (diffDays === 1) return { label: 'Due tomorrow', color: '#f5c842' };
    return { label: 'Due ' + formatted, color: '#555' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks';
      const method = editingTask ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save task');
      await fetchData();
      setModalOpen(false);
      showToast(editingTask ? 'Task updated!' : 'Task created!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTask = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setTasks(t => t.filter(x => x.id !== id));
      showToast('Task deleted');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const toggleStatus = async (task) => {
    const next = task.status === 'done' ? 'todo' : task.status === 'todo' ? 'in_progress' : 'done';
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status: next }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setTasks(t => t.map(x => x.id === task.id ? { ...x, status: next } : x));
    } catch {}
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const filtered = tasks.filter(t => {
    if (filter.status !== 'all' && t.status !== filter.status) return false;
    if (filter.priority !== 'all' && t.priority !== filter.priority) return false;
    if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  if (loading) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid #222', borderTopColor: '#f5c842', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #0a0a0a; color: #fff; font-family: 'DM Mono', monospace; }

        .layout {
          display: flex;
          min-height: 100vh;
        }

        /* SIDEBAR */
        .sidebar {
          width: 240px;
          min-width: 240px;
          background: #0d0d0d;
          border-right: 1px solid #1a1a1a;
          display: flex;
          flex-direction: column;
          padding: 32px 0;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .logo {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          padding: 0 24px 32px;
          border-bottom: 1px solid #1a1a1a;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-dot {
          width: 8px;
          height: 8px;
          background: #f5c842;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .nav {
          padding: 24px 16px;
          flex: 1;
        }

        .nav-label {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #333;
          padding: 0 8px;
          margin-bottom: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          font-size: 13px;
          color: #888;
          cursor: pointer;
          border-radius: 0;
          transition: all 0.15s;
          border-left: 2px solid transparent;
          background: none;
          border-top: none;
          border-right: none;
          border-bottom: none;
          width: 100%;
          text-align: left;
          text-decoration: none;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0;
        }

        .nav-item.active, .nav-item:hover {
          color: #fff;
          border-left-color: #f5c842;
          background: rgba(245,200,66,0.04);
        }

        .nav-badge {
          margin-left: auto;
          font-size: 11px;
          background: #1a1a1a;
          color: #555;
          padding: 2px 8px;
          min-width: 24px;
          text-align: center;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid #1a1a1a;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 8px;
          margin-bottom: 8px;
        }

        .avatar {
          width: 32px;
          height: 32px;
          background: #f5c842;
          color: #0a0a0a;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-name {
          font-size: 13px;
          color: #ccc;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 11px;
          color: #444;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }

        .logout-btn {
          width: 100%;
          background: none;
          border: 1px solid #1a1a1a;
          color: #555;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.05em;
        }

        .logout-btn:hover {
          border-color: #ff5f5f;
          color: #ff5f5f;
        }

        /* MAIN */
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 1px solid #1a1a1a;
          gap: 16px;
          flex-wrap: wrap;
        }

        .page-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .search-wrap {
          position: relative;
        }

        .search-input {
          background: #111;
          border: 1px solid #1a1a1a;
          color: #fff;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          padding: 8px 12px 8px 36px;
          outline: none;
          width: 220px;
          transition: border-color 0.2s;
        }

        .search-input:focus { border-color: #333; }
        .search-input::placeholder { color: #333; }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #333;
          font-size: 14px;
          pointer-events: none;
        }

        select {
          background: #111;
          border: 1px solid #1a1a1a;
          color: #888;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          padding: 8px 12px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
          appearance: none;
          -webkit-appearance: none;
        }

        select:focus { border-color: #333; }

        .create-btn {
          background: #f5c842;
          color: #0a0a0a;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          border: none;
          padding: 9px 20px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .create-btn:hover {
          background: #ffd95a;
          transform: translateY(-1px);
        }

        /* STATS */
        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border-bottom: 1px solid #1a1a1a;
        }

        .stat-card {
          padding: 24px 32px;
          border-right: 1px solid #1a1a1a;
        }

        .stat-card:last-child { border-right: none; }

        .stat-label {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 8px;
        }

        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
        }

        .stat-value.yellow { color: #f5c842; }
        .stat-value.blue { color: #60a5fa; }
        .stat-value.green { color: #4ade80; }

        /* CONTENT */
        .content { padding: 32px; flex: 1; }

        /* TASKS */
        .tasks-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .tasks-count {
          font-size: 12px;
          color: #444;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          border: 1px dashed #1a1a1a;
        }

        .empty-icon {
          font-size: 40px;
          margin-bottom: 16px;
          opacity: 0.3;
        }

        .empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          color: #333;
          margin-bottom: 8px;
        }

        .empty-sub {
          font-size: 12px;
          color: #2a2a2a;
        }

        .task-grid {
          display: grid;
          gap: 12px;
        }

        .task-card {
          background: #111;
          border: 1px solid #1a1a1a;
          padding: 20px 24px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 16px;
          align-items: start;
          transition: border-color 0.2s, transform 0.15s;
          animation: fadeUp 0.3s ease both;
        }

        .task-card:hover {
          border-color: #2a2a2a;
          transform: translateX(2px);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .task-check {
          width: 20px;
          height: 20px;
          border: 1px solid #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.2s;
        }

        .task-check.done {
          background: #4ade80;
          border-color: #4ade80;
        }

        .task-check.in_progress {
          background: transparent;
          border-color: #60a5fa;
        }

        .task-check:hover { border-color: #f5c842; }

        .task-check svg { width: 12px; height: 12px; }

        .task-body { min-width: 0; }

        .task-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .task-title.done {
          text-decoration: line-through;
          color: #444;
        }

        .task-desc {
          font-size: 12px;
          color: #555;
          margin-bottom: 12px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .task-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tag {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 8px;
          border: 1px solid;
        }

        .tag-priority-low { color: #4ade80; border-color: rgba(74,222,128,0.2); background: rgba(74,222,128,0.05); }
        .tag-priority-medium { color: #f5c842; border-color: rgba(245,200,66,0.2); background: rgba(245,200,66,0.05); }
        .tag-priority-high { color: #ff5f5f; border-color: rgba(255,95,95,0.2); background: rgba(255,95,95,0.05); }
        .tag-status-todo { color: #888; border-color: #222; background: #111; }
        .tag-status-in_progress { color: #60a5fa; border-color: rgba(96,165,250,0.2); background: rgba(96,165,250,0.05); }
        .tag-status-done { color: #4ade80; border-color: rgba(74,222,128,0.2); background: rgba(74,222,128,0.05); }

        .task-actions {
          display: flex;
          gap: 6px;
          align-items: center;
          flex-shrink: 0;
        }

        .icon-btn {
          background: none;
          border: 1px solid #1a1a1a;
          color: #444;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.15s;
        }

        .icon-btn:hover { border-color: #f5c842; color: #f5c842; }
        .icon-btn.danger:hover { border-color: #ff5f5f; color: #ff5f5f; }

        /* MODAL */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal {
          background: #111;
          border: 1px solid #222;
          width: 100%;
          max-width: 480px;
          padding: 36px;
          position: relative;
          animation: slideUp 0.25s ease both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #f5c842, transparent);
        }

        .modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 28px;
        }

        .field { margin-bottom: 18px; }

        .m-label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 8px;
        }

        .m-input, .m-textarea, .m-select {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid #222;
          color: #fff;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          padding: 10px 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .m-input:focus, .m-textarea:focus, .m-select:focus { border-color: #f5c842; }
        .m-input::placeholder, .m-textarea::placeholder { color: #333; }

        .m-textarea { resize: vertical; min-height: 80px; }
        .m-select { appearance: none; -webkit-appearance: none; cursor: pointer; }

        .m-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .modal-btns {
          display: flex;
          gap: 10px;
          margin-top: 24px;
        }

        .btn-cancel {
          flex: 1;
          background: none;
          border: 1px solid #222;
          color: #666;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          padding: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover { border-color: #333; color: #999; }

        .btn-save {
          flex: 2;
          background: #f5c842;
          color: #0a0a0a;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.05em;
          border: none;
          padding: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-save:hover:not(:disabled) { background: #ffd95a; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

        /* TOAST */
        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #111;
          border: 1px solid #222;
          border-left: 3px solid #4ade80;
          color: #ccc;
          font-size: 13px;
          padding: 12px 20px;
          z-index: 200;
          animation: slideIn 0.3s ease;
          max-width: 300px;
        }

        .toast.error { border-left-color: #ff5f5f; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* PROGRESS BAR */
        .progress-bar {
          height: 3px;
          background: #1a1a1a;
          margin: 0 32px 24px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #f5c842;
          transition: width 0.5s ease;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .sidebar { display: none; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .stat-card:nth-child(2) { border-right: none; }
          .topbar { padding: 16px 20px; }
          .content { padding: 20px; }
          .stat-card { padding: 16px 20px; }
        }

        @media (max-width: 600px) {
          .stats { grid-template-columns: 1fr 1fr; }
          .search-input { width: 150px; }
          .task-card { grid-template-columns: auto 1fr; }
          .task-actions { grid-column: 2; }
        }
      `}</style>

      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="logo">
            <span className="logo-dot" />
            TaskFlow
          </div>
          <nav className="nav">
            <div className="nav-label">Workspace</div>
            <button className="nav-item active">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6"/><rect x="9" y="1" width="6" height="6"/><rect x="1" y="9" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/></svg>
              All Tasks
              <span className="nav-badge">{tasks.length}</span>
            </button>
            <button className="nav-item" onClick={() => setFilter(f => ({...f, status: 'todo'}))}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/></svg>
              To Do
              <span className="nav-badge">{stats.todo}</span>
            </button>
            <button className="nav-item" onClick={() => setFilter(f => ({...f, status: 'in_progress'}))}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 4v4l3 2"/></svg>
              In Progress
              <span className="nav-badge">{stats.inProgress}</span>
            </button>
            <button className="nav-item" onClick={() => setFilter(f => ({...f, status: 'done'}))}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M5 8l2 2 4-4"/></svg>
              Done
              <span className="nav-badge">{stats.done}</span>
            </button>

            <div className="nav-label" style={{ marginTop: 24 }}>Priority</div>
            {PRIORITIES.map(p => (
              <button key={p} className="nav-item" onClick={() => setFilter(f => ({...f, priority: p}))}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_COLORS[p], flexShrink: 0, display: 'inline-block' }} />
                {p.charAt(0).toUpperCase() + p.slice(1)}
                <span className="nav-badge">{tasks.filter(t => t.priority === p).length}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            {user && (
              <div className="user-info">
                <div className="avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
            )}
            <button className="logout-btn" onClick={logout}>Sign Out</button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="topbar">
            <div>
              <div className="page-title">Tasks</div>
            </div>
            <div className="topbar-actions">
              <div className="search-wrap">
                <span className="search-icon">⌕</span>
                <input
                  className="search-input"
                  placeholder="Search tasks..."
                  value={filter.search}
                  onChange={e => setFilter(f => ({...f, search: e.target.value}))}
                />
              </div>
              <select value={filter.status} onChange={e => setFilter(f => ({...f, status: e.target.value}))}>
                <option value="all">All Status</option>
                {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
              <select value={filter.priority} onChange={e => setFilter(f => ({...f, priority: e.target.value}))}>
                <option value="all">All Priority</option>
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
              <button className="create-btn" onClick={openCreate}>+ New Task</button>
            </div>
          </div>

          {/* STATS */}
          <div className="stats">
            <div className="stat-card">
              <div className="stat-label">Total Tasks</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">To Do</div>
              <div className="stat-value yellow">{stats.todo}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">In Progress</div>
              <div className="stat-value blue">{stats.inProgress}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Completed</div>
              <div className="stat-value green">{stats.done}</div>
            </div>
          </div>

          {/* PROGRESS */}
          {stats.total > 0 && (
            <div className="progress-bar" style={{ marginTop: 24 }}>
              <div className="progress-fill" style={{ width: `${(stats.done / stats.total) * 100}%` }} />
            </div>
          )}

          {/* TASKS */}
          <div className="content">
            <div className="tasks-header">
              <div className="tasks-count">{filtered.length} task{filtered.length !== 1 ? 's' : ''} {filter.status !== 'all' || filter.priority !== 'all' || filter.search ? '(filtered)' : ''}</div>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◻</div>
                <div className="empty-title">{tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}</div>
                <div className="empty-sub">{tasks.length === 0 ? 'Create your first task to get started' : 'Try adjusting your filters'}</div>
              </div>
            ) : (
              <div className="task-grid">
                {filtered.map((task, i) => (
                  <div key={task.id} className="task-card" style={{ animationDelay: `${i * 40}ms` }}>
                    <div
                      className={`task-check ${task.status}`}
                      onClick={() => toggleStatus(task)}
                      title="Cycle status"
                    >
                      {task.status === 'done' && (
                        <svg viewBox="0 0 12 12" fill="none" stroke="#0a0a0a" strokeWidth="2">
                          <path d="M2 6l3 3 5-5" />
                        </svg>
                      )}
                      {task.status === 'in_progress' && (
                        <svg viewBox="0 0 12 12" fill="#60a5fa">
                          <circle cx="6" cy="6" r="3" />
                        </svg>
                      )}
                    </div>
                    <div className="task-body">
                      <div className={`task-title ${task.status}`}>{task.title}</div>
                      {task.description && <div className="task-desc">{task.description}</div>}
                      <div className="task-meta">
                        <span className={`tag tag-priority-${task.priority}`}>{task.priority}</span>
                        <span className={`tag tag-status-${task.status}`}>{STATUS_LABELS[task.status]}</span>
                        {task.due_date && (() => { const due = formatDueDate(task.due_date); return <span style={{ fontSize: '10px', color: due.color, letterSpacing: '0.06em' }}>◷ {due.label}</span>; })()}
                      </div>
                    </div>
                    <div className="task-actions">
                      <button className="icon-btn" onClick={() => openEdit(task)} title="Edit">
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M11 2l3 3-8 8H3v-3l8-8z"/>
                        </svg>
                      </button>
                      <button className="icon-btn danger" onClick={() => deleteTask(task.id)} title="Delete">
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 4h12M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal">
            <div className="modal-title">{editingTask ? 'Edit Task' : 'New Task'}</div>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="m-label">Title</label>
                <input
                  className="m-input"
                  placeholder="What needs to be done?"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="field">
                <label className="m-label">Description</label>
                <textarea
                  className="m-textarea"
                  placeholder="Add more details..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="m-row">
                <div className="field">
                  <label className="m-label">Priority</label>
                  <select className="m-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="m-label">Status</label>
                  <select className="m-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="m-label">Due Date</label>
                <input
                  className="m-input"
                  type="date"
                  value={form.due_date}
                  onChange={e => setForm({ ...form, due_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div className="modal-btns">
                <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingTask ? 'Update Task' : 'Create Task')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`toast ${toast.type}`}>{toast.msg}</div>
      )}
    </>
  );
}