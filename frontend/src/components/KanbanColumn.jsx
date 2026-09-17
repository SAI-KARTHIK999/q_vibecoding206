import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

export default function KanbanColumn({
  id,
  title,
  tasks = [],
  onEditTask,
  onDeleteTask
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: {
      status: id
    }
  });

  const columnThemes = {
    TODO: {
      badge: 'bg-slate-800 text-slate-300 border-slate-700',
      dot: 'bg-slate-400',
      borderFocus: 'border-indigo-500/50 bg-indigo-950/20'
    },
    IN_PROGRESS: {
      badge: 'bg-indigo-950 text-indigo-300 border-indigo-800',
      dot: 'bg-indigo-400 animate-pulse',
      borderFocus: 'border-indigo-500/60 bg-indigo-950/30'
    },
    DONE: {
      badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      dot: 'bg-emerald-400',
      borderFocus: 'border-emerald-500/50 bg-emerald-950/20'
    }
  };

  const theme = columnThemes[id] || columnThemes.TODO;

  return (
    <div
      ref={setNodeRef}
      id={`column-${id.toLowerCase()}`}
      className={`
        flex flex-col rounded-2xl glass-panel p-4 min-h-[500px] transition-colors duration-200
        ${isOver ? theme.borderFocus + ' ring-2 ring-indigo-500/40' : ''}
      `}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`} />
          <h2 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
            {title}
          </h2>
        </div>
        <span
          id={`counter-${id.toLowerCase()}`}
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${theme.badge}`}
        >
          {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
        </span>
      </div>

      {/* Task List Container */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="flex-1 min-h-[140px] flex flex-col items-center justify-center border-2 border-dashed border-slate-800/60 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 font-medium">No tasks in {title}</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Drag tasks here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
