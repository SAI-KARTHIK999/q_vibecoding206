# Task Management App with Server-Side Workload Balancing

A modern, production-grade Kanban task management application for team productivity, featuring **Workload Balancing** with real-time burnout alerts.

---

## 1. Project Overview

The Task Management App provides an intuitive, high-performance Kanban-style workflow (To-Do, In Progress, Done) allowing teams to organize projects, prioritize tasks, assign team members, and prevent burnout.

The signature feature of this application is **Workload Balancing**:
- If a user has **MORE THAN 5** tasks in `In Progress`, their avatar pulses red across the team workload dashboard to warn about potential burnout.
- **Strict Boundary**:
  - `5 tasks in progress` = Normal avatar
  - `6 or more tasks in progress` = Pulsing red avatar

---

## 2. Key Features

- **3-Column Kanban Board**: Live columns for `TO-DO`, `IN PROGRESS`, and `DONE` with real-time task counters.
- **Interactive Drag and Drop**: Smooth drag-and-drop using `@dnd-kit/core` with instant server-side persistence and optimistic UI updates.
- **Server-Side Workload Balancing**: Task calculations strictly calculated on the Express backend (`GET /api/projects/:projectId/workload`), ensuring database-level integrity.
- **Burnout Warning Avatar**: Dynamic CSS glowing red pulse animation on overloaded member avatars.
- **Priority Filtering**: Multi-level filter (`All`, `High`, `Medium`, `Low`) evaluated via backend API parameters.
- **Full Task Lifecycle (CRUD)**: Create, View, Edit, and Delete tasks with validation and due dates.
- **User & Project Management**: Manage multiple projects and team member assignments.

---

## 3. Tech Stack

### Frontend
- **Framework**: React 18
- **Bundler**: Vite
- **Styling**: Tailwind CSS & Vanilla CSS keyframe animations
- **Drag and Drop**: `@dnd-kit/core` & `@dnd-kit/utilities`
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma Client & Prisma CLI
- **Architecture**: Layered architecture (Controllers, Services, Routes, Middleware, Utils)

---

## 4. Architecture

```
task-management-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Sticky header, project switcher, action buttons
│   │   │   ├── KanbanBoard.jsx      # DnD context & column layout
│   │   │   ├── KanbanColumn.jsx     # Droppable column container with task counters
│   │   │   ├── TaskCard.jsx         # Draggable task card with priority & due date
│   │   │   ├── CreateTaskModal.jsx  # Task creation dialog with validation
│   │   │   ├── EditTaskModal.jsx    # Task edit dialog
│   │   │   ├── AddUserModal.jsx     # Team member registration modal
│   │   │   ├── PriorityFilter.jsx   # Dropdown priority filter
│   │   │   ├── TeamList.jsx         # Live workload grid & burnout alert banner
│   │   │   └── UserAvatar.jsx       # Avatar with dynamic pulsing red burnout indicator
│   │   ├── pages/
│   │   │   └── Dashboard.jsx        # Main application dashboard
│   │   ├── services/
│   │   │   └── api.js               # Centralized Axios API client
│   │   ├── hooks/
│   │   │   └── useTasks.js          # Unified state and business hook
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma            # Prisma schema models & enums
│   │   └── seed.js                  # Comprehensive demo seed data
│   ├── src/
│   │   ├── controllers/             # HTTP route handlers
│   │   ├── routes/                  # Express REST route definitions
│   │   ├── services/                # Business logic & database operations
│   │   ├── middleware/              # Error handling & logging middleware
│   │   ├── utils/                   # Prisma instance & validators
│   │   └── server.js                # Express app entrypoint
│   ├── test_api.js                  # Automated test verification suite
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 5. Database Schema

PostgreSQL relational schema managed through Prisma:

```prisma
enum Priority {
  LOW
  MEDIUM
  HIGH
}

enum Status {
  TODO
  IN_PROGRESS
  DONE
}

enum Permission {
  MEMBER
  MANAGER
}

model User {
  id          Int             @id @default(autoincrement())
  name        String
  email       String          @unique
  createdAt   DateTime        @default(now())
  tasks       Task[]
  memberships ProjectMember[]
}

model Project {
  id          Int             @id @default(autoincrement())
  name        String
  description String?
  createdAt   DateTime        @default(now())
  tasks       Task[]
  members     ProjectMember[]
}

model Task {
  id             Int       @id @default(autoincrement())
  projectId      Int
  project        Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignedUserId Int?
  assignedUser   User?     @relation(fields: [assignedUserId], references: [id], onDelete: SetNull)
  title          String
  description    String?
  priority       Priority  @default(MEDIUM)
  status         Status    @default(TODO)
  dueDate        DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model ProjectMember {
  id         Int        @id @default(autoincrement())
  projectId  Int
  project    Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  userId     Int
  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  permission Permission @default(MEMBER)
  createdAt  DateTime   @default(now())

  @@unique([projectId, userId])
}
```

---

## 6. API Endpoints

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks` | List tasks (supports `?projectId=` and `?priority=`) |
| `GET` | `/api/tasks/:id` | Get single task by ID |
| `PUT` | `/api/tasks/:id` | Update task details |
| `DELETE` | `/api/tasks/:id` | Delete task |
| `PATCH` | `/api/tasks/:id/status` | Dedicated status update endpoint (`TODO`, `IN_PROGRESS`, `DONE`) |

### Workload
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects/:projectId/workload` | Returns user workload breakdown and `overloaded` boolean |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/projects` | Create a project |
| `GET` | `/api/projects` | List all projects |
| `GET` | `/api/projects/:id` | Get project details |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |
| `POST` | `/api/projects/:projectId/members` | Add user to project |
| `GET` | `/api/projects/:projectId/members` | Get project team members |

### Users
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users` | Register user |
| `GET` | `/api/users` | List users |
| `GET` | `/api/users/:id` | Get user details |
| `PUT` | `/api/users/:id` | Update user |
| `DELETE` | `/api/users/:id` | Delete user |

---

## 7. Workload Balancing Logic

The workload calculation logic runs on the server in `backend/src/services/workloadService.js`:

```javascript
// Count tasks in IN_PROGRESS for user
const inProgressCount = await prisma.task.count({
  where: {
    projectId: parsedProjectId,
    assignedUserId: user.id,
    status: 'IN_PROGRESS'
  }
});

// CRITICAL BUSINESS RULE: Strictly greater than 5
const overloaded = inProgressCount > 5;
```

### Workload API Response Example:
```json
{
  "projectId": 1,
  "users": [
    {
      "id": 1,
      "name": "Rahul",
      "email": "rahul@example.com",
      "inProgressCount": 6,
      "overloaded": true
    },
    {
      "id": 2,
      "name": "Sai",
      "email": "sai@example.com",
      "inProgressCount": 5,
      "overloaded": false
    }
  ]
}
```

---

## 8. Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+) running locally on port `5432`

### Step 1: Environment Setup
Backend `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_management_db?schema=public"
PORT=5000
```

Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Backend Installation & Migrations
```bash
cd backend
npm install
npx prisma db push
node prisma/seed.js
```

### Step 3: Run Backend Server
```bash
# In backend directory
npm start
# Server will run on http://localhost:5000
```

### Step 4: Frontend Installation & Dev Server
```bash
# In a new terminal
cd frontend
npm install
npm run dev
# Frontend will run on http://localhost:5173
```

---

## 9. Seed Data & Edge Case Demonstration

The database seed provides immediate verification of the workload rules:
- **Rahul**: Has **6 tasks** in `IN_PROGRESS` $\rightarrow$ `overloaded: true` (pulsing red avatar).
- **Sai**: Has **exactly 5 tasks** in `IN_PROGRESS` $\rightarrow$ `overloaded: false` (normal avatar).
- **Karthik**: Has **2 tasks** in `IN_PROGRESS` $\rightarrow$ `overloaded: false` (normal avatar).
- **Anil**: Has **0 tasks** in `IN_PROGRESS` $\rightarrow$ `overloaded: false` (normal avatar).

### Verification Workflow:
1. Open dashboard at `http://localhost:5173`.
2. Notice **Rahul** has a **pulsing red avatar** with an overload badge.
3. Notice **Sai** has a **normal avatar** even with 5 In Progress tasks.
4. Drag one of Rahul's In Progress tasks into the **DONE** column.
5. Rahul's In Progress counter immediately drops to **5** and his avatar automatically reverts to **normal**!
6. Drag the task back to **IN PROGRESS** $\rightarrow$ Rahul reaches 6 and his avatar immediately starts pulsing red again.

---

## 10. Running Automated Tests

A dedicated verification test suite is provided:
```bash
cd backend
node test_api.js
```
This tests:
- `/api/health`
- Project retrieval
- Workload calculation: 6 tasks = overloaded: true; 5 tasks = overloaded: false
- Priority filter query
- PATCH `/api/tasks/:id/status`
- Dynamic workload transition on status change
- Input rejection for invalid statuses
