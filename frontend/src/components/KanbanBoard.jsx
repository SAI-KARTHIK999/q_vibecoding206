import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'TODO', title: 'TO-DO' },
  { id: 'IN_PROGRESS', title: 'IN PROGRESS' },
  { id: 'DONE', title: 'DONE' }
];

export default function KanbanBoard({
  tasks = [],
  onStatusChange,
  onEditTask,
  onDeleteTask
}) {
  const [activeTask, setActiveTask] = useState(null);

  // Require small drag distance (5px) before starting drag to distinguish clicks from drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => String(t.id) === String(active.id));
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = Number(active.id);
    let targetStatus = null;

    // Check if dropped directly onto a column container
    if (['TODO', 'IN_PROGRESS', 'DONE'].includes(over.id)) {
      targetStatus = over.id;
    } else {
      // Or dropped onto another task card inside a column
      const overTask = tasks.find((t) => String(t.id) === String(over.id));
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (targetStatus && taskId) {
      const currentTask = tasks.find((t) => t.id === taskId);
      if (currentTask && currentTask.status !== targetStatus) {
        onStatusChange(taskId, targetStatus);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={columnTasks}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            isOverlay
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
