const prisma = require('../utils/prisma');

/**
 * Calculates workload for all users associated with a project.
 * Critical Business Rule:
 * count > 5  => overloaded = true
 * count <= 5 => overloaded = false
 */
async function getProjectWorkload(projectId) {
  const parsedProjectId = parseInt(projectId, 10);
  if (isNaN(parsedProjectId)) {
    const error = new Error('Invalid project ID');
    error.statusCode = 400;
    throw error;
  }

  const project = await prisma.project.findUnique({
    where: { id: parsedProjectId },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  // Get all members for this project
  const memberUsers = project.members.map(m => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email
  }));

  // Also include any users who have tasks assigned in this project, just in case
  const assignedTasks = await prisma.task.findMany({
    where: {
      projectId: parsedProjectId,
      assignedUserId: { not: null }
    },
    select: {
      assignedUserId: true,
      assignedUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  const userMap = new Map();
  memberUsers.forEach(u => userMap.set(u.id, u));
  assignedTasks.forEach(t => {
    if (t.assignedUser && !userMap.has(t.assignedUser.id)) {
      userMap.set(t.assignedUser.id, t.assignedUser);
    }
  });

  // Calculate In Progress count for each user in this project
  const usersWorkload = await Promise.all(
    Array.from(userMap.values()).map(async (user) => {
      const inProgressCount = await prisma.task.count({
        where: {
          projectId: parsedProjectId,
          assignedUserId: user.id,
          status: 'IN_PROGRESS'
        }
      });

      // STRICT BUSINESS RULE: strictly count > 5
      const overloaded = inProgressCount > 5;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        inProgressCount,
        overloaded
      };
    })
  );

  // Sort by id for predictable UI presentation
  usersWorkload.sort((a, b) => a.id - b.id);

  return {
    projectId: parsedProjectId,
    users: usersWorkload
  };
}

module.exports = {
  getProjectWorkload
};
