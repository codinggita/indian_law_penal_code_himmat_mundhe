# Indian Penal & Legal API Backend

A production-grade, highly-optimized Express.js and Mongoose REST API designed to query and manage legal documents across 8 distinct Indian law acts (`ipc`, `crpc`, `cpc`, `hma`, `iea`, `nia`, `ida`, `mva`) from the `indian_law_db` MongoDB Atlas database.

---

## 🛠️ Tech Stack

* **Runtime Environment**: [Node.js](https://nodejs.org/) (v16+)
* **Framework**: [Express.js](https://expressjs.com/) (RESTful routing API structure)
* **Database ORM**: [Mongoose](https://mongoosejs.com/) (MongoDB Object Modeling ODM)
* **Database Server**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud DB Shards & Replica Set cluster)
* **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) (for secure login/sessions verification)
* **Security & Encryption**: `bcryptjs` (Password hashing) & `cors` (Cross-Origin Resource Sharing)
* **Environment Tooling**: `dotenv` (Environment variable configs) & `nodemon` (Development hot-reloading)

---

## 🚀 Key Features

* **Dynamic Collection Routing**: Endpoints are generic (e.g. `/api/v1/laws`) and dynamically resolve to query the correct MongoDB collection at runtime using the `?act=ipc` query parameter.
* **Heterogeneous Schema Normalization**: Automatically maps diverse collection schemas (such as capitalized `Section` in IPC, and varying title/desc fields in CPC) into a standardized, unified JSON format.
* **On-the-Fly CSV Parser (Hindu Marriage Act)**: Automatically detects and parses CSV formatted string documents within the `hma` collection into individual JSON properties at runtime.
* **Soft Delete Tracking**: Safety audit feature marking records as deleted (`isDeleted: true`) without dropping them from the database.
* **Update History Logs**: Logs all modifications (`PATCH` and `PUT`) into a history timeline inside each document.
* **Robust Global Error & Logging**: Custom logging middleware (requests timing/details) and a global centralized async error boundary wrapping all controllers.
* **Pre-made Postman Collection**: Importable collection file to immediately test all 16 endpoints with configured environment variables.

---

## 📁 Folder Structure

The project follows the standard industry **MVC (Model-View-Controller)** design pattern:

```
indian_law_penal_code_himmat_mundhe/
├── config/
│   └── db.js            # MongoDB Atlas database connection wrapper
├── controllers/
│   └── lawController.js # Handles request arguments, invokes services, and sends JSON
├── models/
│   └── Law.js           # Flexible schema with dynamic collection compilation
├── middlewares/
│   ├── asyncHandler.js  # Higher-order wrapper to catch async exceptions
│   ├── errorHandler.js  # Formats consistent JSON error responses
│   └── logger.js        # Logs incoming requests to terminal console
├── services/
│   └── lawService.js    # Core database actions, CSV parser, and normalizers
├── routes/
│   └── lawRoutes.js     # Maps API endpoints to controllers
├── app.js               # Express application entrypoint
├── .env                 # Environment variables configuration
├── package.json         # Node.js project configuration and scripts
└── Indian_Law_API_Postman_Collection.json # Postman collection file
```

---

## 🛠️ Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* NPM (installed automatically with Node.js)

### Step 1: Clone and install dependencies
Open your terminal in the project directory and run:
```bash
npm install
```

### Step 2: Environment Variables
Create a file named `.env` in the root of the project (if it doesn't already exist) and specify the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=indian_law_penal_code_secret_key_2026_himmat_mundhe
JWT_EXPIRES_IN=7d
NODE_ENV=development
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

## 📖 API Endpoints

All endpoints support a query parameter `?act=<actName>` (defaulting to `ipc`). Allowed values are: `ipc`, `crpc`, `cpc`, `hma`, `iea`, `nia`, `ida`, `mva`.

### 1. General
* `GET /api/v1/health` - Check health status of server and database.

### 2. CRUD Operations
* `GET /api/v1/laws` - Fetch all active laws (supports pagination `page=1&limit=10`, sorting `sort=section` or `sort=-views`, and filtering `isArchived=false`).
* `GET /api/v1/laws/:id` - Fetch a single law by its Mongo ObjectID (increments the view count).
* `POST /api/v1/laws` - Create a new law record.
* `PUT /api/v1/laws/:id` - Fully replace a law record.
* `PATCH /api/v1/laws/:id` - Partially update fields of a law record.
* `DELETE /api/v1/laws/:id` - Soft-delete a law record.

### 3. Utilities & Actions
* `GET /api/v1/laws/exists/:id` - Check if a specific document exists in the collection.
* `GET /api/v1/laws/recent` - Fetch recently created laws.
* `GET /api/v1/laws/archived` - Fetch all archived laws (`isArchived: true`).
* `PATCH /api/v1/laws/:id/archive` - Archive a law document.
* `PATCH /api/v1/laws/:id/restore` - Restore an archived law back to active status.
* `GET /api/v1/laws/:id/history` - Get edit history log list for a law.
* `GET /api/v1/laws/:id/summary` - Fetch a shortened mock summary of the law.
* `GET /api/v1/laws/random` - Pull a random active law record using MongoDB aggregation.
* `GET /api/v1/laws/trending` - Fetch trending laws sorted by most views descending.

---

## 🧪 Testing with Postman

We have exported a complete collection ready to import:
1. Open **Postman**.
2. Click **Import** (top left).
3. Import the file: `Indian_Law_API_Postman_Collection.json`.
4. Go to the collection **Variables** tab to set your `baseUrl` or override the target `lawId` globally for ease of testing!