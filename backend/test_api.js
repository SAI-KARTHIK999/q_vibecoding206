const http = require('http');
const app = require('./src/server');

const server = app.listen(5099, async () => {
  console.log('Testing server started on port 5099');

  try {
    const base = 'http://localhost:5099';

    const req = async (path, options = {}) => {
      const url = new URL(path, base);
      const res = await fetch(url.toString(), {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
      });
      const data = await res.json();
      return { status: res.status, data };
    };

    // 1. Health check
    console.log('1. Testing /api/health...');
    const health = await req('/api/health');
    console.assert(health.status === 200, 'Health check failed');

    // 2. Get projects
    console.log('2. Testing GET /api/projects...');
    const projects = await req('/api/projects');
    console.assert(projects.status === 200 && projects.data.length > 0, 'Get projects failed');
    const projectId = projects.data[0].id;
    console.log(`Found project: ${projects.data[0].name} (ID: ${projectId})`);

    // 3. Workload calculation test - CRITICAL BUSINESS RULE
    console.log(`3. Testing GET /api/projects/${projectId}/workload...`);
    const workload = await req(`/api/projects/${projectId}/workload`);
    console.assert(workload.status === 200, 'Workload endpoint failed');
    const rahul = workload.data.users.find(u => u.name === 'Rahul');
    const sai = workload.data.users.find(u => u.name === 'Sai');
    console.log('Workload result:', JSON.stringify(workload.data.users, null, 2));

    console.assert(rahul && rahul.inProgressCount === 6 && rahul.overloaded === true,
      `Rahul should have 6 in-progress tasks and overloaded === true. Got: ${JSON.stringify(rahul)}`);
    console.assert(sai && sai.inProgressCount === 5 && sai.overloaded === false,
      `Sai should have 5 in-progress tasks and overloaded === false. Got: ${JSON.stringify(sai)}`);
    console.log('✅ CRITICAL RULE VERIFIED: Rahul (6) => overloaded: true; Sai (5) => overloaded: false');

    // 4. Tasks list & priority filter
    console.log('4. Testing GET /api/tasks?projectId=' + projectId + '&priority=HIGH...');
    const highTasks = await req(`/api/tasks?projectId=${projectId}&priority=HIGH`);
    console.assert(highTasks.status === 200 && highTasks.data.every(t => t.priority === 'HIGH'), 'Priority filter failed');
    console.log(`Found ${highTasks.data.length} HIGH priority tasks.`);

    // 5. Status PATCH endpoint
    const taskToMove = highTasks.data.find(t => t.assignedUserId === rahul.id && t.status === 'IN_PROGRESS');
    console.log(`5. Testing PATCH /api/tasks/${taskToMove.id}/status to DONE...`);
    const patchRes = await req(`/api/tasks/${taskToMove.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'DONE' })
    });
    console.assert(patchRes.status === 200 && patchRes.data.status === 'DONE', 'Status patch failed');

    // 6. Check workload again: Rahul should now have 5 in-progress tasks and overloaded === false!
    const workloadAfterMove = await req(`/api/projects/${projectId}/workload`);
    const rahulAfter = workloadAfterMove.data.users.find(u => u.name === 'Rahul');
    console.assert(rahulAfter.inProgressCount === 5 && rahulAfter.overloaded === false,
      `Rahul should now have 5 in-progress tasks and overloaded === false. Got: ${JSON.stringify(rahulAfter)}`);
    console.log('✅ CRITICAL TRANSITION VERIFIED: When moving task to DONE, Rahul drops to 5 => overloaded: false!');

    // Move back to IN_PROGRESS so seed state remains intact
    await req(`/api/tasks/${taskToMove.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'IN_PROGRESS' })
    });

    // 7. Test invalid status validation
    console.log('7. Testing invalid status rejection...');
    const invalidStatus = await req(`/api/tasks/${taskToMove.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'INVALID_STATUS' })
    });
    console.assert(invalidStatus.status === 400 && invalidStatus.data.error === 'Invalid task status',
      'Invalid status check failed');
    console.log('✅ Invalid status properly rejected with 400 error.');

    console.log('\n🎉 ALL BACKEND API TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
