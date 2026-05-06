🚀 TaskFlow: Team Task Management System
TaskFlow is a modern, full-stack Kanban-style task management application designed for high-performance teams. It features a sleek, responsive UI and a robust backend to handle task creation, status tracking, and team collaboration with strict security protocols.

✨ Key Features
Role-Based Access Control (RBAC): Distinct interfaces for Admins and Members. Admins can create tasks and invite members, while Members focus on task execution.

Real-Time Style Notifications: A dynamic notification system that alerts users of task movements, deletions, and logins with a pulsating visual indicator.

Interactive Kanban Board: Full drag-and-drop style functionality via a "Three-Dot" menu to move tasks between To Do, In Progress, and Done.

Live Search & Filtering: An optimized search engine that filters the entire task board in real-time as you type.

Team Management: A dedicated Members page to monitor active team members, their roles, and online status.

Persistent Storage: Integrated with a PostgreSQL database via Prisma ORM for reliable data persistence.

🛠️ Tech Stack
Frontend: React.js, Tailwind CSS, Lucide React (Icons), Axios.

Backend: Node.js, Express.js.

Database & ORM: PostgreSQL, Prisma.

Deployment: Railway (Cloud Hosting).

📂 Project Structure
Plaintext
├── backend/
│   ├── prisma/         # Database Schema
│   ├── routes/         # REST API Endpoints
│   └── server.js       # Express Server Logic
└── src/
    ├── App.js          # Core Application Logic & State
    ├── api.js          # Axios Configuration & Interceptors
    └── index.js        # Entry Point
🚀 Installation & Setup
Clone the repository:

Bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow
Install dependencies:

Bash
    npm install
    # Also install backend dependencies if separate
    cd backend && npm install
    ```

3.  **Setup Environment Variables:**
    Create a `.env` file in the backend directory:
    
```env
    DATABASE_URL="your_postgresql_url_from_railway"
    JWT_SECRET="your_secure_secret_key"
    ```

4.  **Sync Database:**
    
```bash
    npx prisma db push
    ```

5.  **Run the application:**
    ```bash
    npm start
    ```

## 🔐 Security & Validations

*   **JWT Authentication:** Secure login/signup flow using JSON Web Tokens.
*   **Route Protection:** Backend middleware ensures that only authenticated users can access task data.
*   **Role Verification:** Only users with the `ADMIN` role can access the "Create Task" and "Invite Member" features.

---

### 👨‍💻 Developed By
**Vikranth Kalva**  
*Computer Science & Engineering Graduate (2025)*  
*Aspiring Full-Stack Developer | Jangaon, Telangana*