const projectService = require('../services/projectService');

async function createProject(req, res, next) {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
}

async function getProjects(req, res, next) {
  try {
    const projects = await projectService.getProjects();
    res.json(projects);
  } catch (error) {
    next(error);
  }
}

async function getProjectById(req, res, next) {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.json(project);
  } catch (error) {
    next(error);
  }
}

async function updateProject(req, res, next) {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    res.json(project);
  } catch (error) {
    next(error);
  }
}

async function deleteProject(req, res, next) {
  try {
    const result = await projectService.deleteProject(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function addProjectMember(req, res, next) {
  try {
    const member = await projectService.addProjectMember(req.params.projectId, req.body);
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
}

async function getProjectMembers(req, res, next) {
  try {
    const members = await projectService.getProjectMembers(req.params.projectId);
    res.json(members);
  } catch (error) {
    next(error);
  }
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
