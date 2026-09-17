const prisma = require('../utils/prisma');

async function createUser(data) {
  const { name, email } = data;

  if (!name || !name.trim()) {
    const error = new Error('User name is required');
    error.statusCode = 400;
    throw error;
  }

  if (!email || !email.trim()) {
    const error = new Error('User email is required');
    error.statusCode = 400;
    throw error;
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() }
  });
  if (existing) {
    const error = new Error('A user with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  return await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase()
    }
  });
}

async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { id: 'asc' }
  });
}

async function getUserById(id) {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    const error = new Error('Invalid user ID');
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: parsedId }
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function updateUser(id, data) {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    const error = new Error('Invalid user ID');
    error.statusCode = 400;
    throw error;
  }

  const existing = await prisma.user.findUnique({
    where: { id: parsedId }
  });
  if (!existing) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const updateData = {};
  if (data.name) updateData.name = data.name.trim();
  if (data.email) {
    const lowerEmail = data.email.trim().toLowerCase();
    const emailConflict = await prisma.user.findUnique({
      where: { email: lowerEmail }
    });
    if (emailConflict && emailConflict.id !== parsedId) {
      const error = new Error('A user with this email already exists');
      error.statusCode = 409;
      throw error;
    }
    updateData.email = lowerEmail;
  }

  return await prisma.user.update({
    where: { id: parsedId },
    data: updateData
  });
}

async function deleteUser(id) {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    const error = new Error('Invalid user ID');
    error.statusCode = 400;
    throw error;
  }

  const existing = await prisma.user.findUnique({
    where: { id: parsedId }
  });
  if (!existing) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.user.delete({
    where: { id: parsedId }
  });

  return { message: 'User deleted successfully', id: parsedId };
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
