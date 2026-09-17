const workloadService = require('../services/workloadService');

async function getProjectWorkload(req, res, next) {
  try {
    const { projectId } = req.params;
    const workload = await workloadService.getProjectWorkload(projectId);
    res.json(workload);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProjectWorkload
};
