# Financial Habit Builder & Wealth Growth Tracker

A production-ready full-stack MERN application engineered to bridge personal finance logging with disciplined daily habit formation. The platform empowers users to monitor income, expenses, savings targets, and habit streaks while providing comprehensive administrative oversight.

---

## Key Features

- **Authentication & Role-Based Access:** Secure JWT authentication with encrypted passwords via `bcryptjs`, role assignment (`user` vs `admin`), and protected route handling.
- **Cash Flow Ledger:** Real-time income and expense tracking categorized across daily activities with dynamic balance calculations.
- **Financial Habit Builder:** Track daily, weekly, or monthly discipline routines with visual streak counters and timestamped check-in logs.
- **Target Milestones & Savings Goals:** Progressive savings trackers with automatic percentage calculations, deadlines, and direct incremental fund contributions.
- **Visual Analytics:** Interactive dashboards powered by Recharts (inflow vs. outflow bar charts, category-based spending distributions, and goal accumulation pacing).
- **Admin Command Center:** System-wide metrics (total registered users, global transactions, active goals, platform habit counts) paired with user management and search filters.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Lucide React, Recharts, Axios |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js, CORS |
| **Deployment Target** | Render (Backend API), Vercel (Frontend Client) |

---

## Interconnected Page Architecture

The frontend is structured into seven dedicated, responsive page views:
1. **Login & Register (`/login`, `/register`)**: Token issuance, credential verification, and user onboarding.
2. **Command Dashboard (`/`)**: High-level liquidity metrics, net balance, best habit streak, recent transactions, and goal highlights.
3. **Expense Tracker (`/expenses`)**: Comprehensive ledger with category tags, amount tracking, transaction filtering, and entry deletion.
4. **Habit Tracker (`/habits`)**: Habit creation with custom frequency (`daily`, `weekly`, `monthly`), streak progression, and daily check-ins.
5. **Savings Goals (`/goals`)**: Milestone creation, deadline tracking, contribution modals, and progress indicators.
6. **Analytics (`/analytics`)**: Recharts data visualizations showing spending splits and cash flow comparisons.
7. **Admin Panel (`/admin`)**: Restricted administrative view for platform usage analysis, global record totals, and user account directories.

│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
