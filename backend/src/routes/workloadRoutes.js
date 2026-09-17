const express = require('express');
const router = express.Router({ mergeParams: true });
const workloadController = require('../controllers/workloadController');

router.get('/:projectId/workload', workloadController.getProjectWorkload);

module.exports = router;
