import React from 'react';
import { FileText, LogOut, User } from 'lucide-react';

export default function Header({ role, user, onLogout }) {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Campus Submissions</h1>
            <p className="text-xs text-gray-500">Secure portal for assignments & reviews</p>
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-1.5">
              <User size={16} className="text-gray-500" />
              <div className="leading-tight">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Welcome</div>
        )}
      </div>
    </header>
  );
}
