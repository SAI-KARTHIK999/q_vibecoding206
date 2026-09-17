const prisma = require('../utils/prisma');
const { validatePermission } = require('../utils/validation');

async function createProject(data) {
  const { name, description } = data;

  if (!name || !name.trim()) {
    const error = new Error('Project name is required');
    error.statusCode = 400;
    throw error;
  }

  return await prisma.project.create({
    data: {
      name: name.trim(),
      description: description ? description.trim() : null
    }
  });
}

async function getProjects() {
  return await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          tasks: true,
          members: true
        }
      }
    }
  });
}

async function getProjectById(id) {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    const error = new Error('Invalid project ID');
    error.statusCode = 400;
    throw error;
  }

  const project = await prisma.project.findUnique({
    where: { id: parsedId },
    include: {
      members: {
        include: {
          user: true
        }
      },
      tasks: {
        include: {
          assignedUser: true
        }
      }
    }
  });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  return project;
}

async function updateProject(id, data) {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    const error = new Error('Invalid project ID');
    error.statusCode = 400;
    throw error;
  }

  const existing = await prisma.project.findUnique({
    where: { id: parsedId }
  });
  if (!existing) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};
  if (data.name !== undefined) {
    if (!data.name || !data.name.trim()) {
      const error = new Error('Project name is required');
      error.statusCode = 400;
      throw error;
    }
    updateData.name = data.name.trim();
  }

  if (data.description !== undefined) {
    updateData.description = data.description ? data.description.trim() : null;
  }

  return await prisma.project.update({
    where: { id: parsedId },
    data: updateData
  });
}

async function deleteProject(id) {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    const error = new Error('Invalid project ID');
    error.statusCode = 400;
    throw error;
  }

  const existing = await prisma.project.findUnique({
    where: { id: parsedId }
  });
  if (!existing) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.project.delete({
    where: { id: parsedId }
  });

  return { message: 'Project deleted successfully', id: parsedId };
}

async function addProjectMember(projectId, data) {
  const parsedProjectId = parseInt(projectId, 10);
  if (isNaN(parsedProjectId)) {
    const error = new Error('Invalid project ID');
    error.statusCode = 400;
    throw error;
  }

  const { userId, permission = 'MEMBER' } = data;
  const parsedUserId = parseInt(userId, 10);
  if (isNaN(parsedUserId)) {
    const error = new Error('Invalid user ID');
    error.statusCode = 400;
    throw error;
  }

  if (!validatePermission(permission)) {
    const error = new Error('Invalid permission value');
    error.statusCode = 400;
    throw error;
  }

  const project = await prisma.project.findUnique({
    where: { id: parsedProjectId }
  });
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: parsedUserId }
  });
  if (!user) {
    const error = new Error('Assigned user not found');
    error.statusCode = 404;
    throw error;
  }

  const existingMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: parsedProjectId,
        userId: parsedUserId
      }
    }
  });

  if (existingMember) {
    return await prisma.projectMember.update({
      where: {
        projectId_userId: {
          projectId: parsedProjectId,
          userId: parsedUserId
        }
      },
      data: { permission },
      include: { user: true }
    });
  }

  return await prisma.projectMember.create({
    data: {
      projectId: parsedProjectId,
      userId: parsedUserId,
      permission
    },
    include: {
      user: true
    }
  });
}

async function getProjectMembers(projectId) {
  const parsedProjectId = parseInt(projectId, 10);
  if (isNaN(parsedProjectId)) {
    const error = new Error('Invalid project ID');
    error.statusCode = 400;
    throw error;
  }

  const project = await prisma.project.findUnique({
    where: { id: parsedProjectId }
  });
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const members = await prisma.projectMember.findMany({
    where: { projectId: parsedProjectId },
    include: {
      user: true
    },
    orderBy: { id: 'asc' }
  });

  return members;
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  getProjectMembers
};
