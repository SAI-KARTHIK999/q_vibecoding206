import React, { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';

export default function AddUserModal({
  isOpen,
  onClose,
  onSubmit
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('MEMBER');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('User name is required');
      return;
    }
    if (!email.trim()) {
      setError('User email is required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSubmit({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        permission
      });
      onClose();
      setName('');
      setEmail('');
      setPermission('MEMBER');
    } catch (err) {
      setError(err.message || 'Failed to add user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 relative animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-400" />
            <h3 id="add-user-title" className="text-lg font-bold text-white">
              Add Team Member
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="add-user-input-name" className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="add-user-input-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex Morgan"
              className="w-full px-3.5 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="add-user-input-email" className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              id="add-user-input-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-3.5 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="add-user-select-role" className="block text-xs font-semibold text-slate-300 mb-1">
              Project Role / Permission
            </label>
            <select
              id="add-user-select-role"
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="MEMBER">Member</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-add-user-btn"
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? 'Adding user...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
