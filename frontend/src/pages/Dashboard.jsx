import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import PriorityFilter from '../components/PriorityFilter';
import KanbanBoard from '../components/KanbanBoard';
import TeamList from '../components/TeamList';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import AddUserModal from '../components/AddUserModal';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    tasks,
    workload,
    allUsers,
    priorityFilter,
    setPriorityFilter,
    loading,
    actionLoading,
    error,
    clearError,
    handleTaskStatusChange,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleAddUser,
    refreshData
  } = useTasks();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // Column counts
  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const doneCount = tasks.filter((t) => t.status === 'DONE').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onOpenCreateTask={() => setIsCreateModalOpen(true)}
        onOpenAddUser={() => setIsAddUserModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Project Details & Priority Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {selectedProject ? selectedProject.name : 'Select a Project'}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
              </span>
            </div>
            {selectedProject?.description && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {selectedProject.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <PriorityFilter
              currentPriority={priorityFilter}
              onSelectPriority={setPriorityFilter}
            />

            <button
              onClick={refreshData}
              title="Refresh project data"
              className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-xs text-rose-400 hover:text-rose-200 underline font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Action Loading Indicator */}
        {actionLoading && (
          <div className="fixed bottom-5 right-5 z-40 bg-slate-900/95 text-indigo-300 border border-indigo-500/40 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md animate-slide-up">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>{actionLoading}</span>
          </div>
        )}

        {/* Initial Loading State */}
        {loading ? (
          <div className="min-h-[360px] flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm font-medium">Loading tasks...</p>
          </div>
        ) : (
          <>
            {/* Empty State when no tasks exist for priority filter */}
            {tasks.length === 0 && priorityFilter !== 'ALL' && (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 my-4">
                <p className="text-sm text-slate-300 font-semibold">No tasks match this priority.</p>
                <p className="text-xs text-slate-500 mt-1">Try switching back to "All" or create a new task.</p>
                <button
                  onClick={() => setPriorityFilter('ALL')}
                  className="mt-3 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-indigo-400 hover:bg-slate-700"
                >
                  Show All Tasks
                </button>
              </div>
            )}

            {/* Empty State when no tasks in project at all */}
            {tasks.length === 0 && priorityFilter === 'ALL' && (
              <div className="p-10 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 my-4">
                <p className="text-base text-slate-200 font-bold">No tasks found.</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Get started by creating your first task in this project.
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md"
                >
                  + Create First Task
                </button>
              </div>
            )}

            {/* Kanban Board with 3 Columns: TO-DO, IN PROGRESS, DONE */}
            {tasks.length > 0 && (
              <KanbanBoard
                tasks={tasks}
                onStatusChange={handleTaskStatusChange}
                onEditTask={(task) => setEditingTask(task)}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {/* Team Section with Workload Balancing & Burnout Indicator */}
            <TeamList
              workload={workload}
              onAddUserClick={() => setIsAddUserModalOpen(true)}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-5 border-t border-slate-800/80 bg-slate-950/80 text-center text-xs text-slate-500">
        <p>Streamline Task Management &copy; {new Date().getFullYear()} &bull; Workload Balancing Enabled (&gt;5 in-progress burnout alert)</p>
      </footer>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        users={allUsers}
        projects={projects}
        currentProjectId={selectedProjectId}
      />

      <EditTaskModal
        isOpen={Boolean(editingTask)}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        users={allUsers}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
      />
    </div>
  );
}
