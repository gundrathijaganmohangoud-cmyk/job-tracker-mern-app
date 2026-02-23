import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://job-tracker-mern-app.onrender.com/api/jobs';

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ company: '', role: '', status: 'Applied', notes: '' });
  const [filter, setFilter] = useState('All');

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    const res = await axios.get(API);
    setJobs(res.data);
  };

  const addJob = async () => {
    if (!form.company || !form.role) return alert('Company and Role are required!');
    await axios.post(API, form);
    setForm({ company: '', role: '', status: 'Applied', notes: '' });
    fetchJobs();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`${API}/${id}`, { status });
    fetchJobs();
  };

  const deleteJob = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchJobs();
  };

  const statusColor = {
    Applied: '#3b82f6',
    Interview: '#f59e0b',
    Offer: '#22c55e',
    Rejected: '#ef4444'
  };

  const filtered = filter === 'All' ? jobs : jobs.filter(j => j.status === filter);
  const counts = { Total: jobs.length, Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
  jobs.forEach(j => counts[j.status]++);

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center', color: '#1e293b' }}>🗂️ Job Application Tracker</h1>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {Object.entries(counts).map(([key, val]) => (
          <div key={key} style={{ flex: 1, background: '#f1f5f9', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: statusColor[key] || '#1e293b' }}>{val}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{key}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div style={{ background: '#f8fafc', borderRadius: 10, padding: 20, marginBottom: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
          style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', minWidth: 150 }} />
        <input placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
          style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', minWidth: 150 }} />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
          style={{ padding: 10, borderRadius: 6, border: '1px solid #cbd5e1' }}>
          {['Applied', 'Interview', 'Offer', 'Rejected'].map(s => <option key={s}>{s}</option>)}
        </select>
        <input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
          style={{ flex: 2, padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', minWidth: 150 }} />
        <button onClick={addJob}
          style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
          + Add Job
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['All', 'Applied', 'Interview', 'Offer', 'Rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: filter === s ? (statusColor[s] || '#1e293b') : '#e2e8f0',
              color: filter === s ? 'white' : '#475569', fontWeight: filter === s ? 'bold' : 'normal' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Job List */}
      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8' }}>No jobs found. Add one above!</p>
      ) : (
        filtered.map(job => (
          <div key={job._id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: 16 }}>{job.company}</div>
              <div style={{ color: '#64748b' }}>{job.role}</div>
              {job.notes && <div style={{ color: '#94a3b8', fontSize: 13 }}>{job.notes}</div>}
            </div>
            <select value={job.status} onChange={e => updateStatus(job._id, e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, border: `2px solid ${statusColor[job.status]}`, color: statusColor[job.status], fontWeight: 'bold', cursor: 'pointer' }}>
              {['Applied', 'Interview', 'Offer', 'Rejected'].map(s => <option key={s}>{s}</option>)}
            </select>
            <button onClick={() => deleteJob(job._id)}
              style={{ padding: '6px 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;