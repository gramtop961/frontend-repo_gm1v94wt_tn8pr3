import React, { useMemo, useState } from 'react';
import { Download, Filter, PenSquare, Search, Trash2 } from 'lucide-react';

const statusOptions = ['Pending', 'Reviewed', 'Approved', 'Rejected', 'Needs Changes'];

export default function SubmissionsTable({ role, user, submissions, onUpdate, onDelete }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    const rows = submissions.filter((s) => {
      const matchesRole =
        role === 'student' ? s.studentEmail === user?.email : true;
      const matchesQuery = `${s.title} ${s.course} ${s.studentName}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = status === 'All' ? true : s.status === status;
      return matchesRole && matchesQuery && matchesStatus;
    });
    // Sort newest first
    return rows.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  }, [submissions, role, user, query, status]);

  const exportCSV = () => {
    const headers = [
      'Title',
      'Course',
      'Student',
      'File',
      'SizeKB',
      'UploadedAt',
      'Status',
      'Grade',
      'Reviewer',
    ];
    const lines = filtered.map((s) =>
      [
        s.title,
        s.course,
        s.studentName,
        s.fileName,
        (s.size / 1024).toFixed(1),
        s.uploadedAt,
        s.status,
        s.grade ?? '',
        s.reviewer ?? '',
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'submissions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{role === 'student' ? 'My submissions' : 'All submissions'}</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2">
            <Search size={16} className="text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-48 bg-transparent text-sm outline-none placeholder:text-gray-400"
              placeholder="Search..."
            />
          </div>
          <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-transparent text-sm outline-none"
            >
              <option>All</option>
              {statusOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          {(role === 'admin' || role === 'faculty') && (
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <Download size={16} />
              Export CSV
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Course</th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Student</th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">File</th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Uploaded</th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              {(role === 'admin' || role === 'faculty') && (
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-sm text-gray-500">
                  No submissions yet.
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm text-gray-800">
                  <div className="font-medium">{s.title}</div>
                  {s.grade && (
                    <div className="text-xs text-gray-500">Grade: {s.grade}</div>
                  )}
                </td>
                <td className="px-3 py-2 text-sm text-gray-600">{s.course}</td>
                <td className="px-3 py-2 text-sm text-gray-600">{s.studentName}</td>
                <td className="px-3 py-2 text-sm text-indigo-600 underline underline-offset-2">{s.fileName}</td>
                <td className="px-3 py-2 text-sm text-gray-600">{new Date(s.uploadedAt).toLocaleString()}</td>
                <td className="px-3 py-2 text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      s.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : s.status === 'Rejected'
                        ? 'bg-red-100 text-red-700'
                        : s.status === 'Needs Changes'
                        ? 'bg-yellow-100 text-yellow-700'
                        : s.status === 'Reviewed'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                {(role === 'admin' || role === 'faculty') && (
                  <td className="px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <select
                        value={s.status}
                        onChange={(e) => onUpdate(s.id, { status: e.target.value })}
                        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          const g = prompt('Enter grade (e.g., A, 92, Pass):', s.grade ?? '');
                          if (g !== null) onUpdate(s.id, { grade: g, status: 'Reviewed' });
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50"
                      >
                        <PenSquare size={14} /> Grade
                      </button>
                      {role === 'admin' && (
                        <button
                          onClick={() => onDelete(s.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
