import React from 'react';
import { Plus, UserPlus, FolderGit2, Sparkles } from 'lucide-react';

export default function Navbar({
  projects = [],
  selectedProjectId,
  onSelectProject,
  onOpenCreateTask,
  onOpenAddUser
}) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">TASK MANAGEMENT</h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                  KANBAN
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Workload-Balanced Team Productivity</p>
            </div>
          </div>

          {/* Project Switcher */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
              <FolderGit2 className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <span className="text-xs text-slate-400 mr-2 font-medium hidden md:inline">Project:</span>
              <select
                id="project-selector"
                value={selectedProjectId || ''}
                onChange={(e) => onSelectProject(Number(e.target.value))}
                className="bg-transparent text-sm font-semibold text-slate-100 focus:outline-none cursor-pointer pr-4"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id} className="bg-slate-900 text-slate-200">
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="add-user-btn"
              onClick={onOpenAddUser}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-all active:scale-95 shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-indigo-400" />
              <span>+ Add User</span>
            </button>

            <button
              id="create-task-btn"
              onClick={onOpenCreateTask}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-lg shadow-md shadow-indigo-600/25 hover:shadow-indigo-500/40 border border-indigo-400/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Create Task</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
