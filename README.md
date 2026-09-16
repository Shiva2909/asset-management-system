# 🏢 Enterprise Asset Management System (Backend)

A secure, enterprise-grade backend API built for managing company assets, employee allocations, purchase invoices, and role-based access control.

---

## 📁 Project Structure

asset-management-backend/
│
├── controllers/
│   ├── allocationController.js   # Manages asset assignments, returns, and transactions
│   ├── authController.js         # Handles user authentication and login
│   ├── billController.js         # Handles purchase invoices and file records
│   └── ...
│
├── middleware/
│   ├── authMiddleware.js         # JWT verification and role-based access control (RBAC)
│   └── uploadMiddleware.js       # Multer configuration for secure file uploads
│
├── routes/
│   ├── allocationRoutes.js       # Endpoints for asset allocation and tracking
│   ├── authRoutes.js             # Authentication endpoints
│   ├── billRoutes.js             # Endpoints for bills and document uploads
│   └── ...
│
├── uploads/
│   └── invoices/                 # Stored PDF and image invoices
│
├── db.js                         # SQL Server database connection pool configuration
├── server.js                     # Main entry point and server setup
├── package.json                  # Project metadata and dependencies
└── .env                          # Environment variables configuration

---

## 🚀 Tech Stack

*   **Runtime:**  Node.js
*   **Framework:** Express.js
*   **Database:** Microsoft SQL Server (MS SQL via `mssql` package)
*   **Authentication & Security:** JSON Web Tokens (JWT), bcryptjs, CORS
*   **File Handling:** Multer (for secure PDF/Image invoice uploads)

---

## 🛠️ Database Architecture (SQL Server)

The system relies on a relational database design containing the following core tables:
1.  **Employees:** Stores employee credentials, department codes, and organizational data.
2.  **Assets:** Manages inventory items (Laptops, Monitors, etc.) along with their current status (`Available`, `Assigned`, etc.).
3.  **AssetAllocations:** Tracks asset check-outs and check-ins using **ACID-compliant SQL transactions** to ensure zero data corruption.
4.  **AssetBills:** Stores purchase invoices linked to specific assets, along with local file paths for uploaded PDF/Image documents.

---

## 📌 Key Features & Engineering Highlights

*   **ACID Transactions:** Asset allocation and return flows use SQL transactions with automated rollback mechanisms to maintain data integrity.
*   **Role-Based Access Control (RBAC):** Dedicated middlewares (`verifyToken`, `verifyAdmin`) to secure sensitive endpoints.
*   **Secure File Uploads:** Integrated Multer middleware with custom file-type validation (PDF/Images only) and unique timestamp-based naming to prevent file overwrites.
*   **SQL Injection Prevention:** Uses parameterized queries (`request.input`) across all controllers.

---

## ⚙️ Getting Started & Installation


### 2. Install Dependencies
npm install

### 3. Configure Environment Variables (.env)
Create a `.env` file in the root directory and add the following configuration:
PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SERVER=your_server_name
DB_NAME=AssetManagementDB
JWT_SECRET=your_super_secret_key

### 4. Run the Server
# For development (using nodemon)
npm run dev

# For production
npm start

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Authenticate user & generate JWT | Public |
| **GET** | `/api/employees` | Fetch all company employees | Private (Admin) |
| **GET** | `/api/assets` | Retrieve asset inventory | Private (Admin) |
| **POST** | `/api/allocations/assign` | Assign an asset to an employee (Transaction-safe) | Admin Only |
| **POST** | `/api/allocations/return` | Process asset return and update status | Admin Only |
| **POST** | `/api/bills` | Upload invoice file & log purchase bill | Admin Only |
| **GET** | `/api/bills` | Fetch all purchase bills and file paths | Admin Only |

---

## 🛡️ License
This project is developed as a robust enterprise asset tracking solution.