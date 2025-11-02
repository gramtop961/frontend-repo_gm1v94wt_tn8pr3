import React, { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import AuthPanel from './components/AuthPanel.jsx';
import SubmissionForm from './components/SubmissionForm.jsx';
import SubmissionsTable from './components/SubmissionsTable.jsx';
import { BarChart2, CheckCircle, Clock, Users } from 'lucide-react';

function App() {
  const [role, setRole] = useState('student');
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  const handleLogin = (nextRole, userInfo) => {
    setRole(nextRole);
    setUser(userInfo);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const addSubmissions = (rows) => {
    setSubmissions((prev) => [...rows, ...prev]);
  };

  const updateSubmission = (id, patch) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const deleteSubmission = (id) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const metrics = useMemo(() => {
    const all = submissions.length;
    const pending = submissions.filter((s) => s.status === 'Pending').length;
    const approved = submissions.filter((s) => s.status === 'Approved').length;
    const reviewed = submissions.filter((s) => s.status === 'Reviewed').length;
    const usersCount = new Set(submissions.map((s) => s.studentEmail)).size;
    return { all, pending, approved, reviewed, usersCount };
  }, [submissions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <Header role={role} user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {!user ? (
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <AuthPanel onLogin={handleLogin} />
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                  <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-100 blur-3xl" />
                  <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-100 blur-3xl" />
                </div>
                <h2 className="mb-2 text-2xl font-semibold tracking-tight">Interactive file submission portal</h2>
                <p className="mb-6 text-sm text-gray-600">
                  Upload assignments, share notes, and get graded feedback. Faculty can review & grade, and Admins can audit and export. Designed for speed and clarity.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 text-emerald-600" size={16} />
                    Student-friendly uploads with drag & drop
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 text-emerald-600" size={16} />
                    Real-time status updates and grading controls
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 text-emerald-600" size={16} />
                    Powerful filters and CSV export for admins
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {(role === 'admin' || role === 'faculty') && (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Overview</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard icon={BarChart2} label="Total" value={metrics.all} color="indigo" />
                  <MetricCard icon={Clock} label="Pending" value={metrics.pending} color="amber" />
                  <MetricCard icon={CheckCircle} label="Approved" value={metrics.approved} color="emerald" />
                  <MetricCard icon={Users} label="Students" value={metrics.usersCount} color="sky" />
                </div>
              </section>
            )}

            {role === 'student' && (
              <section>
                <SubmissionForm user={user} onCreateSubmission={addSubmissions} />
              </section>
            )}

            <section>
              <SubmissionsTable
                role={role}
                user={user}
                submissions={submissions}
                onUpdate={updateSubmission}
                onDelete={deleteSubmission}
              />
            </section>
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-7xl px-4 py-8 text-center text-xs text-gray-500">
        Built for speed in a live sandbox. This demo uses local state only; connect a backend for persistence and auth.
      </footer>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color = 'indigo' }) {
  const colorMap = {
    indigo: 'text-indigo-600 bg-indigo-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    sky: 'text-sky-600 bg-sky-50',
    amber: 'text-amber-600 bg-amber-50',
  };
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${colorMap[color]}`}>
        <Icon size={20} />
      </div>
    </div>
  );
}

export default App;
