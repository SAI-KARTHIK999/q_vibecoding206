# Walkthrough: Task Management App with Workload Balancing

We have built and verified a complete, production-grade MVP of the **Task Management App** featuring a 3-column Kanban workflow, PostgreSQL database via Prisma, layered Express REST API, and dynamic React + Vite + Tailwind frontend with real-time **Workload Balancing** and burnout alerts.

---

## 1. Visual Verification & Dashboard Snapshot

### Live Application View
![Task Management App Full Page View](file:///C:/Users/saika/.gemini/antigravity-ide/brain/d918ea64-cd69-43d1-8e72-3fa6a3240dfb/full_page_view_1789656665811.png)

### Key UI Features Highlighted
1. **Header & Project Switcher**:
   - Project switcher: `Website Development (22 tasks total)`
   - Quick action buttons: `+ Add User` and `+ Create Task`
2. **Priority Filter**:
   - Dropdown filter: `Priority: [ All ▼ ]` with High, Medium, Low options querying `GET /api/tasks?priority=...`.
3. **3 Kanban Columns with Live Counters**:
   - `TO-DO`: 4 Tasks
   - `IN PROGRESS`: 13 Tasks
   - `DONE`: 5 Tasks
4. **Task Cards**:
   - Cards display: Title, Description, Priority badge (`HIGH`, `MEDIUM`, `LOW`), Due Date, and Assigned User avatar with initials.
   - Dedicated `Edit` and `Delete` action triggers on every card.
5. **Team Workload Balancing Section (Bottom)**:
   - **Burnout Alert Banner**: `⚠️ 1 member overloaded (> 5 tasks in progress!)`
   - **Rahul (`R`)**: **6 In Progress** $\rightarrow$ **Pulsing red avatar & `⚠️ > 5 Tasks` badge**
   - **Sai (`S`)**: **5 In Progress** $\rightarrow$ **Normal avatar & `Normal` status badge** (Strictly $>5$ rule verified!)
   - **Karthik (`K`)**: **2 In Progress** $\rightarrow$ Normal avatar
   - **Anil (`A`)**: **0 In Progress** $\rightarrow$ Normal avatar

---

## 2. Interactive Session Recording

The browser session recording is saved here:
![Session Demo](file:///C:/Users/saika/.gemini/antigravity-ide/brain/d918ea64-cd69-43d1-8e72-3fa6a3240dfb/app_visual_check_1789656439369.webp)

---

## 3. Critical Business Rule Verification

The core specification states:
> **Strictly `count > 5`**:
> - $5$ in-progress tasks = **Normal** avatar
> - $6$ or more in-progress tasks = **Pulsing Red** avatar
> - Server-side calculation on `GET /api/projects/:projectId/workload`

### Server API Response Verification:
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
    },
    {
      "id": 3,
      "name": "Karthik",
      "email": "karthik@example.com",
      "inProgressCount": 2,
      "overloaded": false
    },
    {
      "id": 4,
      "name": "Anil",
      "email": "anil@example.com",
      "inProgressCount": 0,
      "overloaded": false
    }
  ]
}
```

When any card is dragged or updated:
- The frontend sends `PATCH /api/tasks/:id/status` to the server.
- The PostgreSQL database updates the status.
- The server recalculates user workload.
- When Rahul drops from $6 \rightarrow 5$, his avatar immediately returns to normal.

---

## 4. Requirements & Acceptance Matrix

| Requirement Area | Specification | Status |
|---|---|---|
| **Kanban Board** | 3 Columns (`TO-DO`, `IN PROGRESS`, `DONE`), Column Counters, drag-and-drop | ✅ Complete |
| **Workload Balancing** | Strictly $>5$ condition, server-calculated, pulsing red avatar | ✅ Complete |
| **Task Cards** | Title, Description, Priority, Due Date, Assigned User, Edit/Delete | ✅ Complete |
| **Priority Filter** | All, High, Medium, Low backed by server query parameters | ✅ Complete |
| **Modals** | Create Task Modal, Edit Task Modal, Add User Modal | ✅ Complete |
| **Database** | PostgreSQL 18 with Prisma, User, Project, Task, ProjectMember | ✅ Complete |
| **API Endpoints** | Full CRUD for Tasks, Users, Projects, Status PATCH, and Workload | ✅ Complete |
| **Seed Data** | Rahul (6 tasks), Sai (5 tasks), Karthik (2 tasks), Anil (0 tasks) | ✅ Complete |
| **Version Control & Docs**| Git repository initialized, `.env.example`, `.gitignore`, `README.md` | ✅ Complete |
