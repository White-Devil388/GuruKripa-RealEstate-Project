# Guru Kripa Real Estate Project

This workspace is cleanly organized into **2 single projects**:

```text
GuruKripa project/
├── front-end/                     ✨ [Unified Frontend - React + Vite]
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── public/                    # Logos, icons, videos
│   └── src/
│       ├── pages/                 # Public Website Pages (Home, About, Projects, etc.)
│       ├── Admin/                 # Admin Dashboard Pages & Menus
│       ├── Agent/                 # Agent Portal Pages (Before & After Approval)
│       ├── components/            # Shared & Portal Components
│       ├── context/               # React Context Providers
│       ├── routes/                # Unified Routing (Website + Agent/Admin Portals)
│       ├── services/              # Portal API calls
│       ├── api/                   # Public Website API calls
│       └── styles/                # Tailwind & Portal CSS
│
└── back-end/                      ✨ [Unified Backend - Node.js + Express + MongoDB]
    ├── server.js                  # Single Express server (Port: 5000)
    ├── package.json
    ├── seed.js                    # Database Seeding Script
    ├── uploads/                   # Uploaded KYC & Document storage
    └── src/
        ├── apis/                  # System, Auth, Admin, Agent APIs
        ├── routes/                # Public Website APIs (Leads, Projects, Blogs, Media)
        ├── controllers/           # Route Controllers
        ├── models/                # Mongoose Database Models
        ├── middleware/            # Auth, Role & File Upload Middleware
        ├── services/              # Business Logic Services
        └── config/                # Database & JWT Config
```

---

## How to Run

### 1. Run the Back-End
```bash
cd back-end
npm run dev
```
*(Runs the unified API server on **`http://localhost:5000`**)*

- Test/Seed DB: `npm run seed`

### 2. Run the Front-End
Open a second terminal:
```bash
cd front-end
npm run dev
```
*(Runs the unified frontend on **`http://localhost:5173`**)*

---

## Application Features & Routes

- **Public Website (`http://localhost:5173`)**:
  - Displays the full real estate website with ongoing/completed projects, about us, company media, blogs, career openings, and site visit bookings.
- **Login Button Navigation**:
  - Clicking **Login / Sign In** opens the Agent Login portal (`/login`).
  - Dropdown options allow direct navigation to **Admin Login** (`/admin-login`).
  - Clicking **"← Back to Guru Kripa Website"** takes the user back to the public site instantly.
- **Portals**:
  - `/login`: Agent sign-in
  - `/admin-login`: Administrator sign-in
  - `/signup`: Agent registration with KYC
  - `/admin/*`: Administrator operations and management
  - `/agent-before-approval/*`: Agent dashboard (pending KYC)
  - `/agent-after-approval/*`: Agent dashboard (approved)
