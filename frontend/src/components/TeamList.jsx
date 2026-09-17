import React from 'react';
import { Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import UserAvatar from './UserAvatar';

export default function TeamList({ workload = [], onAddUserClick }) {
  const overloadedUsers = workload.filter(u => u.overloaded);

  return (
    <section aria-labelledby="team-section-heading" className="mt-8 pt-6 border-t border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 id="team-section-heading" className="text-sm font-bold tracking-wider text-slate-200 uppercase">
              TEAM WORKLOAD BALANCING
            </h2>
            <p className="text-xs text-slate-400">
              Server-monitored burnout prevention (Warning triggered at &gt; 5 in-progress tasks)
            </p>
          </div>
        </div>

        {overloadedUsers.length > 0 && (
          <div
            id="workload-alert-banner"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-semibold animate-pulse"
          >
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              {overloadedUsers.length} {overloadedUsers.length === 1 ? 'member' : 'members'} overloaded (&gt; 5 tasks in progress)!
            </span>
          </div>
        )}
      </div>

      {workload.length === 0 ? (
        <div className="p-6 text-center rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-sm">
          No team members added.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {workload.map((user) => {
            const isOverloaded = user.overloaded;

            return (
              <div
                key={user.id}
                id={`team-member-${user.id}`}
                className={`
                  p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between
                  ${
                    isOverloaded
                      ? 'bg-red-950/20 border-red-800/60 shadow-lg shadow-red-950/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700/80'
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar
                    name={user.name}
                    size="md"
                    overloaded={isOverloaded}
                    inProgressCount={user.inProgressCount}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-slate-100 truncate">
                        {user.name}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <span className={isOverloaded ? 'text-red-400 font-semibold' : 'text-slate-300 font-medium'}>
                        {user.inProgressCount}
                      </span>
                      <span>In Progress</span>
                    </div>
                  </div>
                </div>

                {/* Status indicator badge */}
                <div>
                  {isOverloaded ? (
                    <span
                      id={`status-badge-${user.id}`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-900/60 text-red-300 border border-red-700/70 shadow-sm"
                      title="Overloaded: Has > 5 In Progress tasks"
                    >
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      &gt; 5 Tasks
                    </span>
                  ) : (
                    <span
                      id={`status-badge-${user.id}`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Normal
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
