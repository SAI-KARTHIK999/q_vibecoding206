import React from 'react';
import { Filter } from 'lucide-react';

export default function PriorityFilter({ currentPriority, onSelectPriority }) {
  const options = [
    { value: 'ALL', label: 'All' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' }
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-sm">
        <Filter className="w-3.5 h-3.5 text-slate-400" />
        <label htmlFor="priority-filter-select" className="text-xs text-slate-400 font-medium">
          Priority:
        </label>
        <select
          id="priority-filter-select"
          value={currentPriority}
          onChange={(e) => onSelectPriority(e.target.value)}
          className="bg-transparent text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none cursor-pointer pr-1"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {currentPriority !== 'ALL' && (
        <button
          onClick={() => onSelectPriority('ALL')}
          className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  );
}
