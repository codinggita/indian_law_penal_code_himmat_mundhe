# Indian Penal & Legal API Backend

A production-grade, highly-optimized Express.js and Mongoose REST API designed to query and manage legal documents across 8 distinct Indian law acts (`ipc`, `crpc`, `cpc`, `hma`, `iea`, `nia`, `ida`, `mva`) from the `indian_law_db` MongoDB Atlas database.

---

## 🛠️ Tech Stack

* **Runtime Environment**: [Node.js](https://nodejs.org/) (v16+)
* **Framework**: [Express.js](https://expressjs.com/) (RESTful routing API structure)
* **Database ORM**: [Mongoose](https://mongoosejs.com/) (MongoDB Object Modeling ODM)
* **Database Server**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud DB Shards & Replica Set cluster)
* **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) (for secure login/sessions verification)
* **Security & Validation**: `bcryptjs` (Password hashing), `express-rate-limit` (Brute force protection), `express-validator` (Custom request validation layer), and `cors` (Cross-Origin Resource Sharing)
* **Email Service**: `nodemailer` (SMTP mail engine for sending OTP codes)
* **Environment Tooling**: `dotenv` (Environment variable configs) & `nodemon` (Development hot-reloading)

---

## 🚀 Key Features

* **Dynamic Collection Routing**: Endpoints are generic (e.g. `/api/v1/laws`) and dynamically resolve to query the correct MongoDB collection at runtime using the `?act=ipc` query parameter.
* **Heterogeneous Schema Normalization**: Automatically maps diverse collection schemas (such as capitalized `Section` in IPC, and varying title/desc fields in CPC) into a standardized, unified JSON format.
* **On-the-Fly CSV Parser (Hindu Marriage Act)**: Automatically detects and parses CSV formatted string documents within the `hma` collection into individual JSON properties at runtime.
* **JWT Authentication System**: Secure user signup, login, profile updates, session tracking, change-password, email verification via OTP, and forgot/reset password flows.
* **Advanced Search & Filtering**: Fast Regex-based keyword search and modular filters supporting query criteria by court name, act, chapter, status, punishment type, bailable, and cognizable.
* **Statistics & Analytics Pipelines**: Aggregates statistical metrics and charts distribution counts using complex MongoDB aggregation pipelines (`$match`, `$group`, `$sort`, `$sample`, `$project`).
* **Admin Dashboard Management**: Admin-only controls enabling user banning/unbanning, role modifications, system health monitoring, system logs viewer, maintenance toggle, and cache flushing.
* **Middleware Practices**: Over 10 dedicated routes demonstrating middleware chaining for logging, caching, compression, security headers, request timing, and validation.

---

## 📁 Folder Structure

All backend code and configurations are organized in the `backend/` directory:

```
indian_law_penal_code_himmat_mundhe/
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB Atlas database connection wrapper
│   ├── controllers/         # MVC request handlers (auth, law, filter, search, stats, etc.)
│   ├── middlewares/         # Auth guard, rate limits, request validators, practice hooks
│   ├── models/              # Mongoose database models (User.js, Law.js)
│   ├── routes/              # Express endpoint routers
│   ├── services/            # Business logic and MongoDB Aggregation Pipelines
│   ├── utils/               # Mail carrier (emailService.js) and helper utilities
│   ├── app.js               # Main Express application assembly
│   ├── package.json         # Scripts, configurations, and dependencies
│   ├── .env                 # Environment secrets
│   └── Indian_Law_API_Postman_Collection.json # Importable Postman file
└── README.md                # Root project documentation
```

---

## 🛠️ Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* NPM (installed automatically with Node.js)

### Step 1: Navigate to the backend directory and install dependencies
Open your terminal in the root folder and run:
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables
Create a file named `.env` in the `backend/` folder and specify the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://<username>:<password>@ac-b9bhjxm-shard-00-00.frff69a.mongodb.net:27017,ac-b9bhjxm-shard-00-01.frff69a.mongodb.net:27017,ac-b9bhjxm-shard-00-02.frff69a.mongodb.net:27017/indian_law_db?ssl=true&replicaSet=atlas-ii8vhh-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development

# Email Configurations (Nodemailer SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Step 3: Run the server
Start the server in development mode using `nodemon` (auto-reloads on file changes):
```bash
npm run dev
```

The console will report a successful connection:
```
Server is running in development mode on port 5000
MongoDB Connected: ac-b9bhjxm-shard-00-00.frff69a.mongodb.net
```

---

## 📖 API Endpoints Reference

All endpoint groups (except Auth and Middleware) support the query parameter `?act=<actName>` (defaulting to `ipc`). Allowed values are: `ipc`, `crpc`, `cpc`, `hma`, `iea`, `nia`, `ida`, `mva`.

### 1. General & Utility
* `GET /api/v1/health` - Check health status of server and database connection.

### 2. Basic CRUD Routes (`/api/v1/laws`)
* `GET /api/v1/laws` - Fetch all active laws (supports pagination `page=1&limit=10`, sorting `sort=section` or `sort=-views`, and filtering `isArchived=false`).
* `GET /api/v1/laws/:id` - Fetch a single law by its ObjectID (increments views).
* `POST /api/v1/laws` - Create a new law record.
* `PUT /api/v1/laws/:id` - Replace a law record completely.
* `PATCH /api/v1/laws/:id` - Partially update fields of a law record.
* `DELETE /api/v1/laws/:id` - Soft-delete a law record (`isDeleted: true`).
* `GET /api/v1/laws/exists/:id` - Check if a specific document exists in the collection.
* `GET /api/v1/laws/recent` - Fetch recently created laws.
* `GET /api/v1/laws/archived` - Fetch all archived laws (`isArchived: true`).
* `PATCH /api/v1/laws/:id/archive` - Archive a law document.
* `PATCH /api/v1/laws/:id/restore` - Restore an archived law back to active status.
* `GET /api/v1/laws/:id/history` - Get edit history log list for a law.
* `GET /api/v1/laws/:id/summary` - Fetch a shortened description summary of the law.
* `GET /api/v1/laws/random` - Pull a random active law record using MongoDB aggregation.
* `GET /api/v1/laws/trending` - Fetch trending laws sorted by most views descending.

### 3. Search & Filtering Routes (`/api/v1/search` & `/api/v1/laws/filter`)
* `GET /api/v1/search/laws?q=...` - Keyword search across section titles and descriptions.
* `GET /api/v1/laws/filter/act/:actName` - Filter by act.
* `GET /api/v1/laws/filter/chapter/:chapterId` - Filter by chapter number.
* `GET /api/v1/laws/filter/section/:sectionNumber` - Filter by exact section number.
* `GET /api/v1/laws/filter/state/:state` - Filter by state laws.
* `GET /api/v1/laws/filter/court/:courtName` - Filter by court name.
* `GET /api/v1/laws/filter/status/:status` - Filter by status (`active` or `repealed`).
* `GET /api/v1/laws/filter/category/:category` - Filter by offense category.
* `GET /api/v1/laws/filter/punishment/:type` - Filter by punishment type.
* `GET /api/v1/laws/filter/bailable/:value` - Filter bailable offenses (`true` or `false`).
* `GET /api/v1/laws/filter/cognizable/:value` - Filter cognizable offenses (`true` or `false`).
* `GET /api/v1/laws/filter/repealed` - Get list of repealed laws.
* `GET /api/v1/laws/filter/constitutional` - Get constitutional specific laws.

### 4. Authentication & JWT Routes (`/api/v1/auth` & `/api/v1/jwt`)
* `POST /api/v1/auth/register` - Register a new user account.
* `POST /api/v1/auth/login` - Login user and generate authentication session.
* `POST /api/v1/auth/logout` - Clear user authentication session.
* `GET /api/v1/auth/profile` - Fetch authenticated user profile details.
* `PATCH /api/v1/auth/profile` - Update user profile information.
* `POST /api/v1/auth/forgot-password` - Trigger forgot password OTP email.
* `POST /api/v1/auth/reset-password` - Verify token and reset password.
* `POST /api/v1/auth/change-password` - Change password from within session.
* `POST /api/v1/auth/verify-email` - Verify email using OTP code sent via Nodemailer.
* `POST /api/v1/auth/send-otp` - Send/Resend OTP code.
* `POST /api/v1/auth/verify-otp` - Verify active OTP code.
* `GET /api/v1/auth/sessions` - Fetch list of active user sessions.
* `POST /api/v1/jwt/generate-token` - Generate raw JWT token.
* `POST /api/v1/jwt/verify-token` - Validate a JWT token.
* `POST /api/v1/jwt/refresh-token` - Refresh expired session token.
* `DELETE /api/v1/jwt/revoke-token` - Revoke token authorization.
* `GET /api/v1/jwt/profile` - Access JWT protected profile route.
* `GET /api/v1/jwt/dashboard` - Access JWT protected dashboard route.
* `GET /api/v1/jwt/private-laws` - Access protected laws database.
* `GET /api/v1/jwt/private-analytics` - Access protected analytics analytics dashboard.

### 5. Statistics & Analytics Routes (`/api/v1/stats` & `/api/v1/analytics`)
* `GET /api/v1/stats/laws/count` - Get count of total laws in database.
* `GET /api/v1/stats/laws/active` - Get count of active laws.
* `GET /api/v1/stats/laws/repealed` - Get count of repealed laws.
* `GET /api/v1/stats/laws/by-act` - Group counts by act.
* `GET /api/v1/stats/laws/by-category` - Group counts by offense category.
* `GET /api/v1/stats/laws/by-state` - Group counts by state.
* `GET /api/v1/stats/laws/by-court` - Group counts by court.
* `GET /api/v1/stats/laws/recent` - Get count statistics for recently created laws.
* `GET /api/v1/stats/laws/trending` - Get view count statistics for trending laws.
* `GET /api/v1/stats/laws/bookmarks` - Get bookmark count statistics.
* `GET /api/v1/analytics/laws/most-viewed` - Analyze most viewed laws.
* `GET /api/v1/analytics/laws/most-bookmarked` - Analyze most bookmarked laws.
* `GET /api/v1/analytics/laws/by-category` - Analyze category-based views.
* `GET /api/v1/analytics/laws/by-state` - Analyze state-based views.
* `GET /api/v1/analytics/laws/by-court` - Analyze court-based views.
* `GET /api/v1/analytics/laws/recent-updates` - Analyze recent updates metrics.
* `GET /api/v1/analytics/laws/popularity` - Analyze overall popularity metrics.
* `GET /api/v1/analytics/laws/search-trends` - Analyze keyword search popularity trends.
* `GET /api/v1/analytics/laws/user-activity` - Analyze user creation and modification behavior.
* `GET /api/v1/analytics/laws/complexity` - Analyze word count and description complexity distributions.

### 6. Administration Routes (`/api/v1/admin`) *(Admin authorization required)*
* `GET /api/v1/admin/users` - Fetch list of all registered users.
* `GET /api/v1/admin/users/:id` - Fetch detailed information for a specific user.
* `PATCH /api/v1/admin/users/:id/ban` - Ban a user account.
* `PATCH /api/v1/admin/users/:id/unban` - Unban a user account.
* `PATCH /api/v1/admin/users/:id/role` - Update user access role (e.g. `'user'` to `'admin'`).
* `GET /api/v1/admin/reports` - Fetch reported content logs.
* `PATCH /api/v1/admin/reports/:id/resolve` - Mark reports as resolved.
* `GET /api/v1/admin/system/health` - Inspect detailed server system metrics.
* `GET /api/v1/admin/system/logs` - Fetch server runtime logs.
* `POST /api/v1/admin/system/maintenance` - Toggle server maintenance mode.
* `DELETE /api/v1/admin/cache/clear` - Flush server cache database.
* `GET /api/v1/admin/security/events` - Fetch system security and brute-force audit logs.

### 7. Middlewares Practice Routes (`/api/v1/middleware`)
* `GET /api/v1/middleware/logger` - Practice logger middleware.
* `GET /api/v1/middleware/auth` - Practice authentication checks.
* `GET /api/v1/middleware/cache` - Practice caching headers.
* `GET /api/v1/middleware/rate-limit` - Practice rate limit throttling.
* `GET /api/v1/middleware/error-handler` - Practice error boundary catcher.
* `GET /api/v1/middleware/request-time` - Practice request timer logger.
* `GET /api/v1/middleware/security` - Practice security headers integration.
* `GET /api/v1/middleware/cors` - Practice CORS headers verification.
* `GET /api/v1/middleware/compression` - Practice Gzip compression behavior.
* `GET /api/v1/middleware/validation` - Practice request validator middleware.

---

## 🧪 Testing with Postman

A complete, pre-configured collection is saved inside the backend directory:
1. Open **Postman**.
2. Click **Import** (top left).
3. Select the file: `backend/Indian_Law_API_Postman_Collection.json`.
4. Go to the collection **Variables** tab to change your `baseUrl` (defaults to `http://localhost:5000/api/v1`) or update `lawId` and authentication tokens to easily test all endpoints across the codebase!