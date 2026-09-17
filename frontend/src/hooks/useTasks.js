import { useState, useEffect, useCallback } from 'react';
import { taskApi, projectApi, userApi } from '../services/api';

export function useTasks() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // 'creating' | 'updating' | 'deleting' | 'moving'
  const [error, setError] = useState(null);

  // Initial load: fetch projects and all users
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedProjects, fetchedUsers] = await Promise.all([
        projectApi.getProjects(),
        userApi.getUsers()
      ]);

      setProjects(fetchedProjects);
      setAllUsers(fetchedUsers);

      if (fetchedProjects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(fetchedProjects[0].id);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    loadInitialData();
  }, []);

  // Fetch project tasks and workload whenever selected project or priority filter changes
  const fetchProjectData = useCallback(async () => {
    if (!selectedProjectId) return;

    try {
      setError(null);
      const params = { projectId: selectedProjectId };
      if (priorityFilter && priorityFilter !== 'ALL') {
        params.priority = priorityFilter;
      }

      const [projectTasks, projectWorkload, members] = await Promise.all([
        taskApi.getTasks(params),
        projectApi.getProjectWorkload(selectedProjectId),
        projectApi.getProjectMembers(selectedProjectId)
      ]);

      setTasks(projectTasks);
      setWorkload(projectWorkload.users || []);
      setTeamMembers(members || []);
    } catch (err) {
      console.error('Failed to fetch project tasks and workload:', err);
      setError(err.message || 'Failed to fetch tasks');
    }
  }, [selectedProjectId, priorityFilter]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectData();
    }
  }, [selectedProjectId, priorityFilter, fetchProjectData]);

  // Refresh workload independently
  const refreshWorkload = async () => {
    if (!selectedProjectId) return;
    try {
      const data = await projectApi.getProjectWorkload(selectedProjectId);
      setWorkload(data.users || []);
    } catch (err) {
      console.error('Failed to refresh workload:', err);
    }
  };

  // Drag and Drop status change
  const handleTaskStatusChange = async (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    setActionLoading('Updating task status...');
    try {
      const updated = await taskApi.updateTaskStatus(taskId, newStatus);
      // Replace with confirmed backend payload
      setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      // CRITICAL: Recalculate server-side workload immediately
      await refreshWorkload();
    } catch (err) {
      console.error('Status update error:', err);
      setError(err.message || 'Failed to update task status');
      // Revert optimistic update
      setTasks(previousTasks);
    } finally {
      setActionLoading(null);
    }
  };

  // Create Task
  const handleCreateTask = async (taskPayload) => {
    setActionLoading('Creating task...');
    try {
      setError(null);
      await taskApi.createTask({
        ...taskPayload,
        projectId: selectedProjectId
      });
      // Refresh tasks and workload
      await fetchProjectData();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to create task');
      throw err;
    } finally {
      setActionLoading(null);
    }
  };

  // Update Task
  const handleUpdateTask = async (taskId, taskPayload) => {
    setActionLoading('Updating task...');
    try {
      setError(null);
      await taskApi.updateTask(taskId, taskPayload);
      await fetchProjectData();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update task');
      throw err;
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    setActionLoading('Deleting task...');
    try {
      setError(null);
      await taskApi.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      await refreshWorkload();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete task');
      throw err;
    } finally {
      setActionLoading(null);
    }
  };

  // Add User
  const handleAddUser = async ({ name, email, permission = 'MEMBER' }) => {
    setActionLoading('Adding user...');
    try {
      setError(null);
      // 1. Create or get user
      const newUser = await userApi.createUser({ name, email });
      setAllUsers(prev => [...prev, newUser]);

      // 2. Associate with current project
      if (selectedProjectId) {
        await projectApi.addProjectMember(selectedProjectId, {
          userId: newUser.id,
          permission
        });
        await fetchProjectData();
      }
      return true;
    } catch (err) {
      setError(err.message || 'Failed to add user');
      throw err;
    } finally {
      setActionLoading(null);
    }
  };

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    tasks,
    workload,
    teamMembers,
    allUsers,
    priorityFilter,
    setPriorityFilter,
    loading,
    actionLoading,
    error,
    clearError: () => setError(null),
    handleTaskStatusChange,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleAddUser,
    refreshData: fetchProjectData
  };
}
