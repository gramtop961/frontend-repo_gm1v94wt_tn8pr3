import React, { useState } from 'react';
import { Lock, Mail, Shield, User } from 'lucide-react';

const roles = [
  { key: 'student', label: 'Student' },
  { key: 'faculty', label: 'Faculty' },
  { key: 'admin', label: 'Admin' },
];

export default function AuthPanel({ onLogin }) {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    onLogin(role, { name, email });
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Sign in</h2>
          <p className="text-sm text-gray-500">Select a role and enter your details</p>
        </div>
        <Shield className="text-indigo-600" />
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        {roles.map((r) => (
          <button
            key={r.key}
            onClick={() => setRole(r.key)}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
              role === r.key
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2">
          <User size={16} className="text-gray-500" />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            placeholder="Full name"
          />
        </div>
        <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2">
          <Mail size={16} className="text-gray-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            placeholder="Email address"
          />
        </div>
        <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2">
          <Lock size={16} className="text-gray-500" />
          <input
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {showPass ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Continue as {role}
        </button>
      </form>

      <p className="mt-3 text-center text-xs text-gray-500">
        Demo sign-in accepts any credentials. Role-based screens will adapt after login.
      </p>
    </div>
  );
}
