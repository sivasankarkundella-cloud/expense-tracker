# ExpenseFlow – Smart Expense Tracker 💳⚡

[![Live Web App](https://img.shields.io/badge/Live_App-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://expense-tracker-vert-phi-32.vercel.app/)
[![Live Backend API](https://img.shields.io/badge/Backend_API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://expense-tracker-izat.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sivasankarkundella-cloud/expense-tracker)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-v4+-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Subqueries_Engine-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)

> A full-stack, responsive financial dashboard web application built with **React.js, Node.js, Express.js, MongoDB, and MySQL Subquery Engine**. Designed for real-world personal finance management and academic lab evaluations.

---

### 🌐 Live Production Deployments
- 🖥️ **Frontend Web Application (Vercel)**: [https://expense-tracker-vert-phi-32.vercel.app](https://expense-tracker-vert-phi-32.vercel.app)
- ⚙️ **Backend API & Portal (Render)**: [https://expense-tracker-izat.onrender.com](https://expense-tracker-izat.onrender.com)
- 📊 **Live Health Check**: [https://expense-tracker-izat.onrender.com/api/health](https://expense-tracker-izat.onrender.com/api/health)
- 💾 **Export MySQL Schema (.sql)**: [https://expense-tracker-izat.onrender.com/api/sql/export-dump](https://expense-tracker-izat.onrender.com/api/sql/export-dump)

---

## 🌟 1. Project Overview

**ExpenseFlow** is a modern personal finance and expense tracking web application. It empowers users to track income and expenses, monitor real-time cash flow balances, filter and search through transaction histories, visualize category distributions and monthly trends with interactive charts, execute real-world SQL subqueries directly in browser, and export reports to CSV or MySQL dumps.

---

## ✨ 2. Key Features

- **📊 Dynamic Dashboard**: Real-time calculated cards for **Total Balance**, **Total Income**, **Total Expenses**, and **Current Month Expenses**.
- **➕ Expense & Income Management**: Full CRUD (Create, Read, Update, Delete) operations with MongoDB persistence.
- **🏷️ Smart Categorization & Payment Tracking**: Filter by categories (*Food, Shopping, Transport, Bills, Entertainment, Education, Health, Travel, Other*) and payment methods (*UPI, Credit Card, Debit Card, Cash, Bank Transfer*).
- **🔍 Instant Search & Multi-Filters**: Real-time title/description keyword search combined with date presets (*Today, This Week, This Month, Custom Range*).
- **📈 Rich Analytics & Visualizations**:
  - Category-wise Spending Donut / Pie Chart
  - Income vs Expense Monthly Comparison Bar Chart
  - Cash Flow & Savings Trend Area Chart
  - Payment Method Breakdown & Savings Rate Meter
- **🎨 Modern Design System**:
  - Dark Mode & Light Mode with persistent user preference
  - Glassmorphism, smooth gradients, rounded cards, and responsive data tables
  - Mobile card views for screens under 768px
- **🌱 Instant Seed Data**: Single-click "Load Demo Data" button to immediately populate realistic data.
- **📄 CSV Export**: Download filtered transactions directly as a `.csv` file.
- **🎓 Lab Syllabus Showcase**: Dedicated `/lab-concepts` page and `ExpenseSummaryClass.jsx` class component demonstrating core React & JavaScript requirements.

---

## 🛠️ 3. Technologies Used

### Frontend
- **React.js 18+ (Vite)**
- **React Router DOM v7** (Declarative client-side routing)
- **Recharts** (Interactive SVG charts: Pie, Bar, Area)
- **Lucide React** (Clean modern iconography)
- **React Hot Toast** (Micro-interaction notifications)
- **Canvas Confetti** (Success animations)
- **Vanilla Modern CSS** (CSS Variables, Flexbox/Grid, Glassmorphism, Responsive Media Queries)

### Backend
- **Node.js** (Runtime environment)
- **Express.js** (REST API framework)
- **Mongoose & MongoDB** (ODM with auto embedded in-memory fallback)
- **CORS & Morgan** (Cross-origin resource sharing & HTTP request logging)
- **Dotenv** (Environment variables management)

---

## 📂 4. Folder Structure

```
expenseflow/
├── package.json               # Root monorepo script coordinator
├── README.md                  # Comprehensive documentation
│
├── client/                    # React Frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx           # Entry point
│       ├── App.jsx            # Routing, Toaster, Modal Providers
│       ├── index.css          # Design system, tokens & responsive styles
│       ├── context/
│       │   └── ThemeContext.jsx # Dark / Light mode provider
│       ├── services/
│       │   └── api.js         # Axios REST client
│       ├── utils/
│       │   └── formatters.jsx # Currency (INR), date & icon helpers
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── DashboardCard.jsx
│       │   ├── ExpenseForm.jsx
│       │   ├── ExpenseItem.jsx
│       │   ├── ExpenseList.jsx
│       │   ├── EditExpenseModal.jsx
│       │   ├── DeleteConfirmModal.jsx
│       │   ├── IncomeForm.jsx
│       │   ├── IncomeList.jsx
│       │   ├── TransactionFilter.jsx
│       │   ├── SearchBar.jsx
│       │   ├── Charts.jsx
│       │   ├── RecentTransactions.jsx
│       │   ├── EmptyState.jsx
│       │   └── ExpenseSummaryClass.jsx  # Syllabus Class Component
│       └── pages/
│           ├── Dashboard.jsx
│           ├── Expenses.jsx
│           ├── Income.jsx
│           ├── Analytics.jsx
│           └── LabConcepts.jsx
│
└── server/                    # Node.js + Express Backend
    ├── package.json
    ├── server.js              # Express app & route mounting
    ├── seedData.js            # Sample dataset & seed logic
    ├── seed.js                # Standalone CLI seeder
    ├── testApi.js             # Automated API test suite
    ├── .env                   # Environment variables
    ├── .env.example
    ├── config/
    │   └── db.js              # Mongoose DB connector with Memory fallback
    ├── models/
    │   ├── Expense.js         # Expense Mongoose Schema
    │   └── Income.js          # Income Mongoose Schema
    ├── controllers/
    │   ├── expenseController.js
    │   ├── incomeController.js
    │   └── dashboardController.js
    ├── routes/
    │   ├── expenseRoutes.js
    │   ├── incomeRoutes.js
    │   ├── dashboardRoutes.js
    │   └── seedRoutes.js
    └── middleware/
        └── errorMiddleware.js
```

---

## ⚙️ 5. Installation & Setup

### Prerequisites
- **Node.js**: v18+ or higher
- **npm**: v9+ or higher
- *(Optional)* **MongoDB**: Local `mongod` or MongoDB Atlas URI (If not present, the backend automatically uses an embedded in-memory MongoDB database so it runs instantly).

---

### Step 1: Install Dependencies
Open a terminal in the root `expenseflow` directory and run:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### Step 2: Configure Environment Variables
In the `server/` directory, verify or adjust the `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/expenseflow
CLIENT_URL=http://localhost:5173
```

*(Note: If you have a MongoDB Atlas cloud cluster, simply replace `MONGO_URI` with your connection string).*

---

### Step 3: Run the Application

#### Option A: Run Server and Client Separately
1. **Start Backend Server** (Port 5000):
   ```bash
   cd server
   npm start
   ```

2. **Start Frontend Dev Server** (Port 5173):
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to: **`http://localhost:5173/`**

---

### Step 4: Run Automated API Tests (Optional Verification)
To verify all REST API endpoints:
```bash
cd server
node testApi.js
```

---

## 📡 6. REST API Endpoints Reference

### Expenses API
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/expenses` | Get all expenses (supports `category`, `paymentMethod`, `startDate`, `endDate`, `search`, `sort`) |
| `GET` | `/api/expenses/:id` | Get single expense by ID |
| `POST` | `/api/expenses` | Create new expense record |
| `PUT` | `/api/expenses/:id` | Update existing expense record |
| `DELETE` | `/api/expenses/:id` | Permanently delete expense record |

### Income API
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/income` | Get all income streams |
| `POST` | `/api/income` | Record a new income inflow |
| `PUT` | `/api/income/:id` | Update income record |
| `DELETE` | `/api/income/:id` | Delete income record |

### Dashboard & Analytics API
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/summary` | Returns dynamically calculated total balance, total income, total expenses, current month expenses, category totals, monthly trend comparisons, and recent items |
| `POST` | `/api/seed` | Populates sample demo records |
| `GET` | `/api/health` | Server health check |

### Lab & Syllabus API (Topics 4.a - 4.e & 5.c)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/lab/hello-world` | **Topic 4.a**: Hello World JSON route |
| `GET` | `/api/lab/hello-world-browser` | **Topic 4.a**: Hello World HTML route for direct browser display |
| `GET` | `/api/lab/website/:page` | **Topic 4.b**: Multi-route website (`/home`, `/about`, `/services`, `/contact`) |
| `GET` | `/api/lab/browser-console` | **Topic 4.c**: Express route dispatching `console.log()` to browser |
| `GET` | `/api/lab/crud/items` | **Topic 4.d**: READ all CRUD items (200 OK) |
| `POST` | `/api/lab/crud/items` | **Topic 4.d**: CREATE new item (201 Created) |
| `PUT` | `/api/lab/crud/items/:id` | **Topic 4.d**: UPDATE item by ID (200 OK) |
| `DELETE` | `/api/lab/crud/items/:id` | **Topic 4.d**: DELETE item by ID (200 OK) |
| `GET` | `/api/lab/mysql/connection-test` | **Topic 4.e**: Test connection between API & Database via `mysql2` driver |
| `GET` | `/api/lab/mysql/subqueries-demo` | **Topic 5.c**: Executes Scalar, Derived Table & Correlated subqueries |

---

## ⚡ 7. Unit 4: Node.js & Express.js Lab Implementation

### 4.a. Hello World in Route through Browser
- **Express Route Handler**: Implemented in [`server/routes/labRoutes.js`](file:///c:/Users/sivas/OneDrive/Desktop/expenseflow/server/routes/labRoutes.js)
```javascript
app.get('/api/lab/hello-world', (req, res) => {
  res.status(200).json({ message: 'Hello World from Express.js!' });
});

app.get('/api/lab/hello-world-browser', (req, res) => {
  res.send('<h1>Hello World from Express.js!</h1>');
});
```

### 4.b. Small Website with Multiple Routes using Express.js
- Implemented with Express Router mounting `/api/lab/website/home`, `/api/lab/website/about`, `/api/lab/website/services`, and `/api/lab/website/contact`.

### 4.c. Print 'Hello World' in Browser Console using Express.js
- Express delivers client JavaScript payload with embedded `console.log()` instructions or dispatches custom debugging headers:
```javascript
router.get('/browser-console', (req, res) => {
  res.send(`
    <script>
      console.log("%c✨ Hello World from Express.js! ✨", "color: #10b981; font-size: 16px; font-weight: bold;");
    </script>
  `);
});
```

### 4.d. CRUD Operations using Express.js
- Implemented standard RESTful HTTP verbs with proper status codes:
  - **Create**: `POST /api/lab/crud/items` (HTTP 201 Created)
  - **Read**: `GET /api/lab/crud/items` & `GET /api/lab/crud/items/:id` (HTTP 200 OK)
  - **Update**: `PUT /api/lab/crud/items/:id` (HTTP 200 OK)
  - **Delete**: `DELETE /api/lab/crud/items/:id` (HTTP 200 OK)

### 4.e. Connection between API and Database using Express - MySQL Driver
- Integrated using `mysql2/promise` connection pooling in [`server/config/mysqlDb.js`](file:///c:/Users/sivas/OneDrive/Desktop/expenseflow/server/config/mysqlDb.js).
```javascript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: 'expenseflow_db',
  connectionLimit: 10,
  waitForConnections: true
});

export const executeMySQLQuery = async (sql, params = []) => {
  const [results] = await pool.execute(sql, params);
  return results;
};
```

---

## 🐬 8. Unit 5: Introduction to MySQL & CLI Implementation

### 5.a. Create Database & Table inside Database using MySQL CLI
Open MySQL Command Line Client:
```sql
-- Authenticate & Open CLI
mysql -u root -p

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS expenseflow_db;
USE expenseflow_db;

-- 2. Create Table with Constraints
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT 1,
    title VARCHAR(150) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL,
    payment_method ENUM('UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer') DEFAULT 'UPI',
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Verify Table
SHOW TABLES;
DESCRIBE expenses;
```

### 5.b. MySQL Queries: Create Table, Insert, Update, and Delete Data
All queries are packaged in [`server/database/schema.sql`](file:///c:/Users/sivas/OneDrive/Desktop/expenseflow/server/database/schema.sql):
```sql
-- INSERT Data
INSERT INTO expenses (title, amount, category, payment_method, date, notes) 
VALUES ('Campus Cafeteria Lunch', 180.00, 'Food', 'UPI', '2026-03-10', 'Lunch with team'),
       ('Operating Systems Textbook', 850.00, 'Education', 'Debit Card', '2026-03-12', 'Reference book');

-- UPDATE Data
UPDATE expenses 
SET amount = 220.00, notes = 'Lunch + Coffee' 
WHERE id = 1;

-- DELETE Data
DELETE FROM expenses WHERE id = 10;
```

### 5.c. MySQL Queries Implementing Subqueries
1. **Scalar Subquery** (Find expenses above overall average amount):
```sql
SELECT id, title, amount, category, date
FROM expenses
WHERE amount > (SELECT AVG(amount) FROM expenses)
ORDER BY amount DESC;
```

2. **Derived Table Subquery** (Aggregate category spending in FROM clause):
```sql
SELECT cat_summary.category, cat_summary.total_spent
FROM (
    SELECT category, SUM(amount) AS total_spent
    FROM expenses
    GROUP BY category
) AS cat_summary
WHERE cat_summary.total_spent > 1000.00
ORDER BY cat_summary.total_spent DESC;
```

3. **Correlated Subquery** (Find highest transaction per category):
```sql
SELECT e1.id, e1.title, e1.category, e1.amount
FROM expenses e1
WHERE e1.amount = (
    SELECT MAX(e2.amount)
    FROM expenses e2
    WHERE e2.category = e1.category
)
ORDER BY e1.amount DESC;
```

---

## 🎓 9. React & JavaScript Concepts Demonstrated

### React Concepts
1. **React Class Component**: Implemented in [`client/src/components/ExpenseSummaryClass.jsx`](file:///c:/Users/sivas/OneDrive/Desktop/expenseflow/client/src/components/ExpenseSummaryClass.jsx) with `constructor`, `this.state`, `componentDidMount()`, `componentDidUpdate()`, and custom calculation methods.
2. **React Functional Components**: Used across all views (Dashboard, Expenses, Income, Analytics, LabConcepts).
3. **React Hooks**: `useState`, `useEffect`, `useContext`, `useCallback`.
4. **Props & Destructuring**: Clean modular component hierarchy.
5. **Conditional Rendering**: Loading skeletons, empty states, and modal dialogs.
6. **Controlled Forms & Events**: Two-way state binding with event handling.
7. **Iterative List Rendering (`map()`)**: Displaying tabular rows and charts with unique key props.
8. **Template Literals**: Dynamically constructing CSS classes, currency strings, and query parameters.

### JavaScript Concepts
- **Arrow Functions**: Concise lexical binding for callbacks and array operations.
- **Array Methods**: `filter()`, `reduce()`, `sort()`, `map()`, `find()`, `slice()`.
- **Destructuring**: Extracting values from objects and arrays in controllers and components.
- **Spread Operator (`...`)**: Immutable state updates and merging query parameters.
- **Async/Await & Promises**: Non-blocking asynchronous network requests with Axios and Mongoose.
- **ES6 Modules**: Native `import` / `export` across frontend and backend.

---

## 🔒 10. Error Handling & Quality Controls

- **Frontend**: Graceful loading skeletons, inline field validation, toast error popups, and non-crashing empty states.
- **Backend**: Structured Express error middleware with custom handlers for Mongoose `ValidationError`, `CastError` (bad ObjectId), and 404 routes.
- **CORS & Environment Isolation**: Strict separation of configuration and secrets via `.env`.

---

## 🚀 11. Demonstration Highlights for Evaluators

1. **Academic Evaluation Hub**: Visit the `/lab-concepts` route for live testbeds for **Node/Express (4.a-4.e)**, **MySQL & Subqueries (5.a-5.c)**, and **React Class Components**.
2. **Dashboard Overview**: Review dynamic summary cards that update live on CRUD actions.
3. **Interactive Charts**: Category spending donut chart and monthly comparison bar charts powered by Recharts.
4. **Filtering & Search**: Real-time keyword search, category filters, and date range filters.
5. **Dark Mode**: Instant theme switching with persistent local storage.
6. **Export CSV**: Download filtered transaction records into CSV files.
7. **MySQL CLI Script**: Execute `server/database/schema.sql` directly inside the MySQL CLI client.
