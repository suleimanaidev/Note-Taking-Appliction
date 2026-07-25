# 📝 NoteVault - Full-Stack MERN Note Application

A modern, high-performance **MERN Stack** (MongoDB, Express.js, React 18, Node.js) note-taking platform featuring dual-mode **JWT Authentication** (HTTP-only cookies + Authorization Bearer headers), real-time debounced search, category tagging, note pinning, soft trash recovery, and one-click JSON backup export.

---

## 🌟 Key Features

- 🔒 **Dual-Mode JWT Authentication**: Secure user login/registration using `bcryptjs` password hashing with support for both `httpOnly` cookies AND `Authorization: Bearer <token>` headers (ideal for Postman & mobile API clients).
- ⚡ **Real-Time Live Search**: Debounced searching across note titles, contents, and categories with server-side pagination.
- 📌 **Pin Important Notes**: Dedicated endpoint (`PATCH /api/notes/:id/pin`) to keep priority notes pinned to the top of your workspace.
- 🎨 **8 Color Accents & Categories**: Tag notes with categories (`Personal`, `Work`, `Study`, `Ideas`, `Shopping`, `Travel`, `Health`, `Finance`) and visual color strips.
- 📊 **Notes Stats & Breakdown**: Instant statistics endpoint (`GET /api/notes/stats`) for total notes, category breakdown, pinned items, and trash counts.
- 📥 **Export JSON Backup**: One-click note backup downloader (`GET /api/notes/export`) to save your notes safely on your local device.
- 🗑️ **Soft Trash Bin & Recovery**: Soft deletion mechanism allowing notes to be restored or permanently removed.
- 🌙 **Persisted Dark & Light Themes**: Theme preferences stored directly in the user profile in MongoDB.
- 🚀 **Zero-Config Database**: Automatic fallback to `mongodb-memory-server` if local MongoDB is not running.
- 📦 **Single-Server Production Serving**: Express automatically serves compiled Vite React static assets in production.

---

## 📁 Repository Structure

```text
Note Application/
├── package.json                   # Root orchestrator scripts (dev, build, start)
├── README.md                      # Complete documentation & setup guide
├── backend/                       # Node.js + Express + Mongoose API Server
│   ├── config/
│   │   └── db.js                  # MongoDB connection & MemoryServer fallback
│   ├── controllers/
│   │   ├── authController.js      # Register, login, logout, me, theme logic
│   │   └── noteController.js      # CRUD, search, filter, sort, pin, trash, stats & export
│   ├── middleware/
│   │   ├── authMiddleware.js      # Dual JWT guard (Cookie + Bearer header)
│   │   └── validate.js            # Express-validator error handling
│   ├── models/
│   │   ├── User.js                # User Mongoose Schema
│   │   └── Note.js                # Note Mongoose Schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth endpoints
│   │   └── noteRoutes.js          # /api/notes endpoints
│   ├── .env                       # Backend environment variables
│   ├── .env.example               # Environment template
│   ├── package.json               # Backend dependencies
│   └── server.js                  # Express server initialisation & static file serving
└── frontend/                      # Modern Vite + React Single Page Application
    ├── public/                    # Static public assets
    ├── src/
    │   ├── components/            # NoteCard, TrashCard, NoteModal, ConfirmModal, Sidebar, Topbar
    │   ├── context/               # AuthContext & ToastContext
    │   ├── pages/                 # LandingPage, AuthPage, NotesPage, TrashPage
    │   ├── App.jsx & main.jsx     # Main React App components
    │   └── index.css              # Custom design system, glassmorphism & animations
    ├── index.html                 # HTML template shell
    ├── package.json               # Frontend dependencies
    └── vite.config.js             # Vite bundler config with backend proxy
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, Lucide Icons, Vanilla CSS (Space Grotesk + JetBrains Mono fonts)
- **Backend**: Node.js, Express.js, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, `cookie-parser`, `express-validator`, `helmet`, `express-rate-limit`
- **Database**: MongoDB (Mongoose ODM) with `mongodb-memory-server` zero-config fallback

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18.0.0`
- npm `>= 9.0.0`

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "Note Application"
   ```

2. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/notevault
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   ```

---

## 🏃 Running the Application

### Development Mode (Decoupled Frontend + Backend)
Starts the Express API on `http://localhost:5000` and Vite dev server on `http://localhost:3000`:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

### Production Mode (Unified Single-Port Server)
Builds the frontend production bundle and starts the unified Express server serving both the REST API and React SPA on `http://localhost:5000`:
```bash
npm run build
npm start
```

---

## 📡 API Endpoints & Usage

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user & return JWT token |
| `POST` | `/api/auth/login` | Authenticate user, set cookie & return JWT token |
| `POST` | `/api/auth/logout` | Clear auth token cookie & session |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `PUT` | `/api/auth/theme` | Update user dark/light theme preference |

### Notes Routes (`/api/notes`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notes` | Get user notes (supports `search`, `category`, `sort`, `page`, `limit`) |
| `POST` | `/api/notes` | Create a new note |
| `PUT` | `/api/notes/:id` | Update note title, content, category, color, or pin status |
| `PATCH` | `/api/notes/:id/pin` | Toggle note pinned status |
| `DELETE` | `/api/notes/:id` | Soft delete note (move to trash bin) |
| `GET` | `/api/notes/stats` | Get note count statistics & category breakdown |
| `GET` | `/api/notes/export` | Download JSON file backup of all active notes |
| `GET` | `/api/notes/trash` | Get soft-deleted notes |
| `POST` | `/api/notes/trash/:id/restore` | Restore soft-deleted note |
| `DELETE` | `/api/notes/trash/:id` | Permanently delete single note |
| `DELETE` | `/api/notes/trash/empty` | Permanently empty trash bin |

---

## 🔑 Testing JWT with cURL / Postman

### 1. Authenticate & Obtain JWT Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### 2. Access Protected Routes via Bearer Token
```bash
curl -X GET http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
