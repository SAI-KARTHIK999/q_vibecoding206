import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function UserAvatar({
  name = 'User',
  size = 'md',
  overloaded = false,
  inProgressCount = null,
  showBadge = true
}) {
  // Get initials (up to 2 characters)
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  // Size configurations
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-bold'
  };

  // Color selection based on name hash
  const colors = [
    'from-blue-600 to-indigo-600 text-white',
    'from-emerald-600 to-teal-600 text-white',
    'from-purple-600 to-pink-600 text-white',
    'from-amber-500 to-orange-600 text-white',
    'from-cyan-600 to-blue-600 text-white'
  ];
  const colorIndex = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % colors.length;
  const normalBg = colors[colorIndex];

  return (
    <div className="relative inline-flex items-center justify-center">
      <div
        id={`avatar-${name.toLowerCase().replace(/\s+/g, '-')}`}
        data-overloaded={overloaded ? "true" : "false"}
        data-count={inProgressCount ?? 0}
        title={overloaded ? `⚠️ ${name} is overloaded (${inProgressCount} In-Progress tasks)! Potential burnout.` : `${name} (${inProgressCount ?? 0} In-Progress)`}
        className={`
          ${sizeClasses[size] || sizeClasses.md}
          rounded-full flex items-center justify-center select-none shadow-sm transition-all duration-300
          ${
            overloaded
              ? 'bg-gradient-to-br from-rose-600 to-red-700 text-white border-2 border-red-400 pulse-burnout ring-4 ring-red-500/30'
              : `bg-gradient-to-br ${normalBg} border border-white/20 hover:ring-2 hover:ring-indigo-400/40`
          }
        `}
      >
        <span>{initials}</span>
      </div>

      {/* Burnout warning icon indicator */}
      {overloaded && showBadge && (
        <span
          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 shadow-md ring-2 ring-slate-900 flex items-center justify-center animate-bounce"
          title="Overload warning: > 5 tasks in progress"
        >
          <AlertCircle className="w-3 h-3 text-white" />
        </span>
      )}
    </div>
  );
}
