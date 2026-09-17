const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing records
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const usersData = [
    { name: 'Rahul', email: 'rahul@example.com' },
    { name: 'Sai', email: 'sai@example.com' },
    { name: 'Karthik', email: 'karthik@example.com' },
    { name: 'Anil', email: 'anil@example.com' }
  ];

  const createdUsers = {};
  for (const u of usersData) {
    const user = await prisma.user.create({ data: u });
    createdUsers[u.name] = user;
    console.log(`Created user: ${user.name} (id: ${user.id})`);
  }

  // 2. Create Project
  const project = await prisma.project.create({
    data: {
      name: 'Website Development',
      description: 'Full-stack enterprise e-commerce platform revamp and microservices migration'
    }
  });
  console.log(`Created project: ${project.name} (id: ${project.id})`);

  // 3. Associate Users with Project
  await prisma.projectMember.createMany({
    data: [
      { projectId: project.id, userId: createdUsers['Rahul'].id, permission: 'MANAGER' },
      { projectId: project.id, userId: createdUsers['Sai'].id, permission: 'MEMBER' },
      { projectId: project.id, userId: createdUsers['Karthik'].id, permission: 'MEMBER' },
      { projectId: project.id, userId: createdUsers['Anil'].id, permission: 'MEMBER' }
    ]
  });
  console.log('Added project members with roles.');

  // 4. Create Tasks
  // CRITICAL REQUIREMENT:
  // - Rahul: 6 tasks in IN_PROGRESS (overloaded = true -> PULSING RED AVATAR)
  // - Sai: EXACTLY 5 tasks in IN_PROGRESS (overloaded = false -> NORMAL AVATAR)
  // - Karthik: 2 tasks in IN_PROGRESS (overloaded = false -> NORMAL AVATAR)
  // - Anil: 0 tasks in IN_PROGRESS (overloaded = false -> NORMAL AVATAR)

  const tasksToCreate = [
    // Rahul's 6 IN_PROGRESS tasks (Triggering Overload Warning)
    {
      title: 'Implement OAuth2 & JWT Authentication',
      description: 'Setup token generation, refresh tokens, and role-based access control middleware.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Rahul'].id,
      projectId: project.id
    },
    {
      title: 'Design PostgreSQL Schema & Indexes',
      description: 'Normalize tables, define primary/foreign keys, and add performance indexes for query speed.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Rahul'].id,
      projectId: project.id
    },
    {
      title: 'Build Payment Gateway Webhook Handler',
      description: 'Listen to Stripe checkout sessions and update invoice statuses idempotently.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Rahul'].id,
      projectId: project.id
    },
    {
      title: 'Setup Redis Caching Layer',
      description: 'Implement distributed cache for product catalog and workload aggregation.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Rahul'].id,
      projectId: project.id
    },
    {
      title: 'Optimize REST Endpoint Latency',
      description: 'Analyze slow queries with pg_stat_statements and refactor N+1 queries.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Rahul'].id,
      projectId: project.id
    },
    {
      title: 'Configure Rate Limiting & Security Headers',
      description: 'Add Helmet, CORS restrictions, and IP rate limiting on public endpoints.',
      priority: 'LOW',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Rahul'].id,
      projectId: project.id
    },
    // Rahul's other tasks
    {
      title: 'CI/CD Pipeline with GitHub Actions',
      description: 'Automate linting, unit test suite, and Docker container deployment.',
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Rahul'].id,
      projectId: project.id
    },
    {
      title: 'System Architecture Blueprint',
      description: 'Initial system diagram and sequence charts completed and reviewed.',
      priority: 'HIGH',
      status: 'DONE',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Rahul'].id,
      projectId: project.id
    },

    // Sai's EXACTLY 5 IN_PROGRESS tasks (Threshold Boundary: strictly > 5 required for warning)
    {
      title: 'Build Kanban Board Drag & Drop Canvas',
      description: 'Interactive dnd-kit columns with smooth animations and multi-touch support.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Sai'].id,
      projectId: project.id
    },
    {
      title: 'Implement Workload Visual Indicator',
      description: 'Add subtle pulsing red border animation for overloaded team members.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Sai'].id,
      projectId: project.id
    },
    {
      title: 'Develop Responsive Navigation Bar',
      description: 'Sticky header with project switcher, quick action modals, and user profile avatar.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Sai'].id,
      projectId: project.id
    },
    {
      title: 'Create Task Modal with Validation',
      description: 'Accessible modal dialog with client and server error boundary messages.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Sai'].id,
      projectId: project.id
    },
    {
      title: 'Design Priority Badge Component',
      description: 'Curated color chips for HIGH (Rose), MEDIUM (Amber), and LOW (Emerald) priorities.',
      priority: 'LOW',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Sai'].id,
      projectId: project.id
    },
    // Sai's other tasks
    {
      title: 'Implement Dark Mode Theme Support',
      description: 'Tailwind CSS dark variant configuration with system preference fallback.',
      priority: 'LOW',
      status: 'TODO',
      dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Sai'].id,
      projectId: project.id
    },
    {
      title: 'UX Wireframing & Design System Setup',
      description: 'Figma prototypes and Tailwind token hierarchy established.',
      priority: 'HIGH',
      status: 'DONE',
      dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Sai'].id,
      projectId: project.id
    },

    // Karthik's tasks (2 IN_PROGRESS, well below threshold)
    {
      title: 'Audit WCAG 2.1 AA Accessibility',
      description: 'Verify keyboard navigation, screen reader ARIA labels, and contrast ratios.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Karthik'].id,
      projectId: project.id
    },
    {
      title: 'Write Automated End-to-End Test Suite',
      description: 'Comprehensive test flows covering task creation, dragging, and workload reactivity.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Karthik'].id,
      projectId: project.id
    },
    {
      title: 'Configure Sentry Error Monitoring',
      description: 'Integrate real-time crash reporting and source map upload.',
      priority: 'LOW',
      status: 'TODO',
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Karthik'].id,
      projectId: project.id
    },
    {
      title: 'Setup ESLint & Prettier Pre-commit Hooks',
      description: 'Husky and lint-staged automation for consistent code format.',
      priority: 'LOW',
      status: 'DONE',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Karthik'].id,
      projectId: project.id
    },

    // Anil's tasks (0 IN_PROGRESS)
    {
      title: 'Prepare Staging Deployment Environment',
      description: 'Setup Cloud infrastructure, VPC peering, and SSL certificates.',
      priority: 'HIGH',
      status: 'TODO',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Anil'].id,
      projectId: project.id
    },
    {
      title: 'Draft Technical API Documentation',
      description: 'OpenAPI specification and Swagger UI interactive docs.',
      priority: 'MEDIUM',
      status: 'DONE',
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Anil'].id,
      projectId: project.id
    },
    {
      title: 'Database Backup & Disaster Recovery Runbook',
      description: 'Automated pg_dump snapshots to encrypted S3 bucket.',
      priority: 'MEDIUM',
      status: 'DONE',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      assignedUserId: createdUsers['Anil'].id,
      projectId: project.id
    }
  ];

  for (const t of tasksToCreate) {
    await prisma.task.create({ data: t });
  }

  console.log(`✅ Successfully seeded ${tasksToCreate.length} tasks!`);
  console.log('Workload summary:');
  console.log('- Rahul: 6 in-progress (OVERLOADED: true)');
  console.log('- Sai: 5 in-progress (OVERLOADED: false)');
  console.log('- Karthik: 2 in-progress (OVERLOADED: false)');
  console.log('- Anil: 0 in-progress (OVERLOADED: false)');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
