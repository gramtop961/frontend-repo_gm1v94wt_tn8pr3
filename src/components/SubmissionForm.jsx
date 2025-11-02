import React, { useRef, useState } from 'react';
import { CloudUpload, File, Loader2 } from 'lucide-react';

export default function SubmissionForm({ user, onCreateSubmission }) {
  const [course, setCourse] = useState('CS101');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = Array.from(e.dataTransfer.files || []);
    if (f.length) setFiles((prev) => [...prev, ...f]);
  };

  const onBrowse = (e) => {
    const f = Array.from(e.target.files || []);
    if (f.length) setFiles((prev) => [...prev, ...f]);
  };

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || files.length === 0) return;
    setSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      onCreateSubmission(
        files.map((file) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          studentName: user.name,
          studentEmail: user.email,
          course,
          title,
          notes,
          fileName: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          status: 'Pending',
          grade: null,
          reviewer: null,
        }))
      );
      setTitle('');
      setNotes('');
      setFiles([]);
      setSubmitting(false);
    }, 700);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Submit assignment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">Course</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>CS101</option>
              <option>ENG202</option>
              <option>MATH150</option>
              <option>PHY210</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Project Report Week 3"
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Share any context for your reviewer"
          />
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <CloudUpload className="mb-2 text-indigo-600" />
          <p className="text-sm text-gray-700">
            Drag & drop files here, or <span className="font-semibold text-indigo-600">browse</span>
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={onBrowse}
          />
          <p className="mt-1 text-xs text-gray-500">PDF, DOCX, PPTX, ZIP up to 20MB each</p>
        </div>

        {files.length > 0 && (
          <div className="rounded-md border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {files.map((f, idx) => (
                <li key={idx} className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <File size={16} className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{f.name}</p>
                      <p className="text-xs text-gray-500">{(f.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-xs text-gray-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setFiles([]);
              setTitle('');
              setNotes('');
            }}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={submitting || files.length === 0 || !title}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
