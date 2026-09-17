import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Edit3, Trash2, GripVertical, AlertCircle } from 'lucide-react';
import UserAvatar from './UserAvatar';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  isOverlay = false
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(task.id),
    data: {
      task
    }
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : undefined,
        opacity: isDragging ? 0.4 : 1
      }
    : undefined;

  // Format due date (e.g. 20 Sep 2026)
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const priorityStyles = {
    HIGH: 'bg-rose-950/70 text-rose-300 border-rose-800/60 font-semibold',
    MEDIUM: 'bg-amber-950/70 text-amber-300 border-amber-800/60 font-medium',
    LOW: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60 font-medium'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`task-card-${task.id}`}
      className={`
        glass-card rounded-xl p-4 shadow-sm group relative cursor-grab active:cursor-grabbing select-none
        ${isOverlay ? 'border-indigo-500 shadow-2xl scale-105 rotate-1 ring-2 ring-indigo-500/50 bg-slate-850' : ''}
      `}
    >
      {/* Header: Priority & Action Buttons */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <div
            {...attributes}
            {...listeners}
            className="text-slate-500 hover:text-slate-300 p-0.5 rounded cursor-grab active:cursor-grabbing focus:outline-none"
            title="Drag to move task"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <span
            className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded-md border tracking-wider uppercase ${
              priorityStyles[task.priority] || priorityStyles.MEDIUM
            }`}
          >
            Priority: {task.priority}
          </span>
        </div>

        {/* Edit & Delete buttons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            id={`edit-task-btn-${task.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors"
            title="Edit task"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            id={`delete-task-btn-${task.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h3 className="text-sm font-semibold text-slate-100 mb-1.5 leading-snug line-clamp-2">
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-slate-400 mb-3.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Card Footer: Due Date & Assigned User */}
      <div className="pt-2.5 mt-2 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-300">
        {/* Due date */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Due: {task.dueDate ? formatDueDate(task.dueDate) : 'No date'}</span>
        </div>

        {/* Assigned user */}
        <div className="flex items-center gap-1.5 font-medium">
          {task.assignedUser ? (
            <>
              <UserAvatar
                name={task.assignedUser.name}
                size="sm"
                showBadge={false}
              />
              <span className="text-slate-200 truncate max-w-[100px]" title={task.assignedUser.name}>
                {task.assignedUser.name}
              </span>
            </>
          ) : (
            <span className="text-slate-500 italic">Unassigned</span>
          )}
        </div>
      </div>
    </div>
  );
}
