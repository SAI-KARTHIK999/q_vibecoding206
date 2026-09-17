const prisma = require('../utils/prisma');
const { validateStatus, validatePriority } = require('../utils/validation');

async function createTask(data) {
  const { title, description, priority = 'MEDIUM', status = 'TODO', dueDate, assignedUserId, projectId } = data;

  if (!title || !title.trim()) {
    const error = new Error('Task title is required');
    error.statusCode = 400;
    throw error;
  }

  if (!projectId) {
    const error = new Error('Project ID is required');
    error.statusCode = 400;
    throw error;
  }

  const parsedProjectId = parseInt(projectId, 10);
  if (isNaN(parsedProjectId)) {
    const error = new Error('Invalid project ID');
    error.statusCode = 400;
    throw error;
  }

  const projectExists = await prisma.project.findUnique({
    where: { id: parsedProjectId }
  });
  if (!projectExists) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  if (priority && !validatePriority(priority)) {
    const error = new Error('Invalid task priority');
    error.statusCode = 400;
    throw error;
  }

  if (status && !validateStatus(status)) {
    const error = new Error('Invalid task status');
    error.statusCode = 400;
    throw error;
  }

  let parsedAssignedUserId = null;
  if (assignedUserId !== undefined && assignedUserId !== null && assignedUserId !== '') {
    parsedAssignedUserId = parseInt(assignedUserId, 10);
    if (isNaN(parsedAssignedUserId)) {
      const error = new Error('Invalid assigned user ID');
      error.statusCode = 400;
      throw error;
    }
    const userExists = await prisma.user.findUnique({
      where: { id: parsedAssignedUserId }
    });
    if (!userExists) {
      const error = new Error('Assigned user not found');
      error.statusCode = 404;
      throw error;
    }
  }

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description ? description.trim() : null,
      priority: priority || 'MEDIUM',
      status: status || 'TODO',
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId: parsedProjectId,
      assignedUserId: parsedAssignedUserId
    },
    include: {
      assignedUser: {
        select: { id: true, name: true, email: true }
      },
      project: {
        select: { id: true, name: true }
      }
    }
  });

  return task;
}

async function getTasks(query) {
  const { projectId, priority, status } = query;
  const where = {};

  if (projectId) {
    const parsedProjectId = parseInt(projectId, 10);
    if (!isNaN(parsedProjectId)) {
      where.projectId = parsedProjectId;
    }
  }

  if (priority) {
    const upperPriority = priority.toUpperCase();
    if (!validatePriority(upperPriority)) {
      const error = new Error('Invalid task priority');
      error.statusCode = 400;
      throw error;
    }
    where.priority = upperPriority;
  }

  if (status) {
    const upperStatus = status.toUpperCase();
    if (!validateStatus(upperStatus)) {
      const error = new Error('Invalid task status');
      error.statusCode = 400;
      throw error;
    }
    where.status = upperStatus;
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    include: {
      assignedUser: {
        select: { id: true, name: true, email: true }
      },
      project: {
        select: { id: true, name: true }
      }
    }
  });

  return tasks;
}

async function getTaskById(id) {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    const error = new Error('Invalid task ID');
    error.statusCode = 400;
    throw error;
  }

  const task = await prisma.task.findUnique({
    where: { id: parsedId },
    include: {
      assignedUser: {
        select: { id: true, name: true, email: true }
      },
      project: {
        select: { id: true, name: true }
      }
    }
  });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  return task;
}

async function updateTask(id, data) {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    const error = new Error('Invalid task ID');
    error.statusCode = 400;
    throw error;
  }

  const existingTask = await prisma.task.findUnique({
    where: { id: parsedId }
  });
  if (!existingTask) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};

  if (data.title !== undefined) {
    if (!data.title || !data.title.trim()) {
      const error = new Error('Task title is required');
      error.statusCode = 400;
      throw error;
    }
    updateData.title = data.title.trim();
  }

  if (data.description !== undefined) {
    updateData.description = data.description ? data.description.trim() : null;
  }

  if (data.priority !== undefined) {
    if (!validatePriority(data.priority)) {
      const error = new Error('Invalid task priority');
      error.statusCode = 400;
      throw error;
    }
    updateData.priority = data.priority;
  }

  if (data.status !== undefined) {
    if (!validateStatus(data.status)) {
      const error = new Error('Invalid task status');
      error.statusCode = 400;
      throw error;
    }
    updateData.status = data.status;
  }

  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }

  if (data.assignedUserId !== undefined) {
    if (data.assignedUserId === null || data.assignedUserId === '') {
      updateData.assignedUserId = null;
    } else {
      const parsedAssignedUserId = parseInt(data.assignedUserId, 10);
      if (isNaN(parsedAssignedUserId)) {
        const error = new Error('Invalid assigned user ID');
        error.statusCode = 400;
        throw error;
      }
      const userExists = await prisma.user.findUnique({
        where: { id: parsedAssignedUserId }
      });
      if (!userExists) {
        const error = new Error('Assigned user not found');
        error.statusCode = 404;
        throw error;
      }
      updateData.assignedUserId = parsedAssignedUserId;
    }
  }

  const updatedTask = await prisma.task.update({
    where: { id: parsedId },
    data: updateData,
    include: {
      assignedUser: {
        select: { id: true, name: true, email: true }
      },
      project: {
        select: { id: true, name: true }
      }
    }
  });

  return updatedTask;
}

async function updateTaskStatus(id, status) {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    const error = new Error('Invalid task ID');
    error.statusCode = 400;
    throw error;
  }

  if (!validateStatus(status)) {
    const error = new Error('Invalid task status');
    error.statusCode = 400;
    throw error;
  }

  const existingTask = await prisma.task.findUnique({
    where: { id: parsedId }
  });
  if (!existingTask) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  const updatedTask = await prisma.task.update({
    where: { id: parsedId },
    data: { status },
    include: {
      assignedUser: {
        select: { id: true, name: true, email: true }
      },
      project: {
        select: { id: true, name: true }
      }
    }
  });

  return updatedTask;
}

async function deleteTask(id) {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    const error = new Error('Invalid task ID');
    error.statusCode = 400;
    throw error;
  }

  const existingTask = await prisma.task.findUnique({
    where: { id: parsedId }
  });
  if (!existingTask) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.task.delete({
    where: { id: parsedId }
  });

  return { message: 'Task deleted successfully', id: parsedId, projectId: existingTask.projectId };
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
};
