const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const workloadController = require('../controllers/workloadController');

router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Project member routes
router.post('/:projectId/members', projectController.addProjectMember);
router.get('/:projectId/members', projectController.getProjectMembers);

// Workload route
router.get('/:projectId/workload', workloadController.getProjectWorkload);

module.exports = router;
