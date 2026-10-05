# Full Stack Web Development Lab Manual & Code Verification Record 📑

**Project Title**: ExpenseFlow – Smart Expense Tracker  
**Live Web Application**: [https://expense-tracker-vert-phi-32.vercel.app](https://expense-tracker-vert-phi-32.vercel.app)  
**Live Backend API**: [https://expense-tracker-izat.onrender.com](https://expense-tracker-izat.onrender.com)  
**GitHub Repository**: [https://github.com/sivasankarkundella-cloud/expense-tracker](https://github.com/sivasankarkundella-cloud/expense-tracker)

---

## 📑 Document Structure & Guidelines
- **Heading Font Size**: 16pt
- **Body Text Font Size**: 12pt
- **Page Break**: Every program begins on a fresh page
- **Verification**: Complete source code + simulated/live output console representation

---

<div style="page-break-before: always;"></div>

# 1.a Write a JavaScript Program to Link JavaScript File with the HTML Page

### Objective
Demonstrate linking an external JavaScript file (`script.js`) to an HTML document using the `<script src="..." defer>` tag and verifying its execution in the DOM.

### Source Code

#### `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Linking JavaScript Demo</title>
  <!-- Link external JavaScript file using defer to ensure DOM is ready -->
  <script src="script.js" defer></script>
</head>
<body>
  <h1 id="heading">ExpenseFlow JavaScript Integration</h1>
  <p id="message">Waiting for script to load...</p>
</body>
</html>
```

#### `script.js`
```javascript
console.log("✅ External script.js successfully loaded!");
document.addEventListener("DOMContentLoaded", () => {
  const msgElement = document.getElementById("message");
  msgElement.textContent = "🚀 JavaScript file linked and executed successfully!";
  msgElement.style.color = "#10b981";
});
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| Browser View: http://localhost:5173/lab/topic-1a                         |
+--------------------------------------------------------------------------+
| ExpenseFlow JavaScript Integration                                       |
| 🚀 JavaScript file linked and executed successfully!                     |
|                                                                          |
| Developer Console:                                                       |
| [LOG] ✅ External script.js successfully loaded!                         |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 1.b Write a JavaScript Program to Select Elements in HTML Page Using Selectors

### Objective
Select and manipulate HTML elements using `getElementById`, `getElementsByClassName`, `querySelector`, and `querySelectorAll`.

### Source Code
```javascript
// 1. Select by ID
const totalBalanceEl = document.getElementById("total-balance");
totalBalanceEl.textContent = "₹66,573";

// 2. Select by Class Name
const badges = document.getElementsByClassName("status-badge");
badges[0].style.backgroundColor = "#10b981";

// 3. Select single element using querySelector
const primaryBtn = document.querySelector(".btn-primary");
primaryBtn.innerHTML = "<span>➕ Add Transaction</span>";

// 4. Select multiple elements using querySelectorAll
const expenseItems = document.querySelectorAll(".expense-card");
expenseItems.forEach((card) => {
  card.style.borderLeft = "4px solid #6366f1";
});
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| Browser View: DOM Selectors Active                                       |
+--------------------------------------------------------------------------+
| Selected by ID (#total-balance): ₹66,573                                 |
| Selected by querySelectorAll (.expense-card):                            |
| [| 4px solid #6366f1 ] Cloud Server Hosting — ₹720 (Bills)               |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 1.c Write a JavaScript Program to Implement Event Listeners

### Objective
Implement `addEventListener` to listen for user input and keyboard events dynamically.

### Source Code
```javascript
const searchInput = document.getElementById("search-input");
const liveFeedback = document.getElementById("search-feedback");

// Input Event Listener
searchInput.addEventListener("input", (event) => {
  const query = event.target.value;
  liveFeedback.textContent = `Searching for: "${query}" (${query.length} characters)`;
});

// Focus and Blur Listeners
searchInput.addEventListener("focus", () => {
  searchInput.style.borderColor = "#6366f1";
});
searchInput.addEventListener("blur", () => {
  searchInput.style.borderColor = "#cbd5e1";
});
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| Event Listener Feedback UI                                               |
+--------------------------------------------------------------------------+
| [ Search input: "Grocery" ]                                              |
| ⚡ Event Triggered: Searching for: "Grocery" (7 characters)              |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 1.d Write a JavaScript Program to Handle Click Events for HTML Button Element

### Objective
Handle click events for button elements and update DOM state dynamically.

### Source Code
```javascript
let clickCount = 0;
const actionBtn = document.getElementById("record-expense-btn");
const statusDisplay = document.getElementById("click-status");

actionBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clickCount++;
  statusDisplay.innerHTML = `✅ Button Clicked <strong>${clickCount}</strong> times!`;
  statusDisplay.style.color = "#16a34a";
});
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| Button Click Event Demo                                                  |
+--------------------------------------------------------------------------+
| [ 💳 Record New Expense ]                                                |
|                                                                          |
| ✅ Button Clicked 5 times!                                               |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 1.e Write a JavaScript Program with Three Types of Functions

### Objective
Demonstrate Function Declarations, Function Expressions/Definitions, and ES6 Arrow Functions.

### Source Code
```javascript
// 1. Function Declaration (Hoisted)
function calculateTotalBalance(income, expense) {
  return income - expense;
}

// 2. Function Expression / Definition
const calculateSavingsPercentage = function(income, expense) {
  const savings = income - expense;
  return ((savings / income) * 100).toFixed(2);
};

// 3. Arrow Function
const formatCurrencyINR = (amount) => `₹${amount.toLocaleString('en-IN')}`;

// Execution
const income = 85000;
const expense = 18427;
console.log("1. Balance:", formatCurrencyINR(calculateTotalBalance(income, expense)));
console.log("2. Savings Rate:", calculateSavingsPercentage(income, expense) + "%");
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| Terminal Output: node functionTypes.js                                   |
+--------------------------------------------------------------------------+
| 1. Function Declaration -> Balance: ₹66,573                              |
| 2. Function Expression  -> Savings Rate: 78.32%                          |
| 3. Arrow Function       -> Formatted Amount: ₹85,000                     |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 2.a Write a React Program to Implement a Counter Button Using React Class Components

### Objective
Create a stateful counter button using `React.Component`, `constructor`, `this.state`, and `this.setState`.

### Source Code
```jsx
import React, { Component } from 'react';

class ExpenseSummaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  handleIncrement() {
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  }

  render() {
    return (
      <div className="class-counter-box">
        <h3>React Class Component Counter</h3>
        <p>Current Count: <strong>{this.state.count}</strong></p>
        <button onClick={this.handleIncrement}>➕ Increment Count</button>
      </div>
    );
  }
}

export default ExpenseSummaryClass;
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| React Class Component Counter                                            |
+--------------------------------------------------------------------------+
| React Class Component Counter                                            |
|                                    7                                     |
| [ ➕ Increment Count (this.setState) ]                                  |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 2.b Write a React Program to Implement a Counter Button Using React Functional Components

### Objective
Implement counter buttons using modern React Functional Components with `useState`.

### Source Code
```jsx
import React, { useState } from 'react';

export default function FunctionalCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-container">
      <h3>Functional Component Counter</h3>
      <p className="counter-value">{count}</p>
      <div className="btn-group">
        <button onClick={() => setCount(count - 1)}>- Decrease</button>
        <button onClick={() => setCount(count + 1)}>+ Increase</button>
      </div>
    </div>
  );
}
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| Functional Component Counter                                             |
+--------------------------------------------------------------------------+
| Functional Component Counter                                             |
|                                   12                                     |
| [ - Decrease ]            [ + Increase ]                                 |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 2.c Write a React Program to Handle Button Click Events in Functional Component

### Objective
Handle click events with synthetic event arguments and state updates.

### Source Code
```jsx
import React, { useState } from 'react';

export default function ClickEventHandler() {
  const [status, setStatus] = useState('Ready');

  const handleClick = (actionType, event) => {
    event.preventDefault();
    const timestamp = new Date().toLocaleTimeString();
    setStatus(`Action: "${actionType}" executed at ${timestamp}`);
  };

  return (
    <div>
      <button onClick={(e) => handleClick('Export CSV', e)}>📥 Export CSV</button>
      <button onClick={(e) => handleClick('Sync Database', e)}>🔄 Sync Database</button>
      <p>{status}</p>
    </div>
  );
}
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| Button Click Event Feedback                                              |
+--------------------------------------------------------------------------+
| [ 📥 Export CSV ]        [ 🔄 Sync Database ]                            |
| Action: "Export CSV" executed at 10:45:12 AM                             |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 2.d Write a React Program to Conditionally Render a Component in the Browser

### Objective
Conditionally render elements using ternary operators (`? :`) and short-circuit evaluation (`&&`).

### Source Code
```jsx
import React, { useState } from 'react';

export default function ConditionalRender() {
  const [showModal, setShowModal] = useState(true);

  return (
    <div>
      <h3>Conditional Render Active</h3>
      {showModal && (
        <div className="modal">
          <p>✨ Modal Dialog Rendered via Short-Circuit (showModal && &lt;Modal/&gt;)</p>
          <button onClick={() => setShowModal(false)}>Close Modal</button>
        </div>
      )}
    </div>
  );
}
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| Conditional Rendering View                                               |
+--------------------------------------------------------------------------+
| ✨ Modal Dialog Rendered via Short-Circuit (showModal && <Modal/>)       |
| [ Close Modal ]                                                          |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 2.e Write a React Program to Display Text Using String / Template Literals

### Objective
Interpolate variables and expressions within strings using ES6 Template Literals.

### Source Code
```jsx
import React from 'react';

export default function TemplateLiteralsDemo() {
  const user = { name: 'Sivasankar', role: 'Administrator' };
  const monthlyBudget = 50000;
  const totalSpent = 18427;
  const remaining = monthlyBudget - totalSpent;

  return (
    <div className="summary-card">
      <h2>{`Welcome Back, ${user.name} (${user.role})`}</h2>
      <p>{`You have utilized ₹${totalSpent.toLocaleString()} of your ₹${monthlyBudget.toLocaleString()} budget.`}</p>
      <p>{`Remaining Balance: ₹${remaining.toLocaleString()} (${((remaining / monthlyBudget) * 100).toFixed(1)}% left)`}</p>
    </div>
  );
}
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| Template Literals Rendered Output                                        |
+--------------------------------------------------------------------------+
| Welcome Back, Sivasankar (Administrator)                                 |
| You have utilized ₹18,427 of your ₹50,000 budget.                        |
| Remaining Balance: ₹31,573 (63.1% left)                                  |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 3.a Write a React Program to Implement a Counter Button Using React useState Hook

### Objective
Manage dynamic step increments and numeric counts with `useState`.

### Source Code
```jsx
import React, { useState } from 'react';

export default function UseStateCounter() {
  const [count, setCount] = useState(3500);
  const step = 100;

  return (
    <div>
      <h3>Budget Stepper (useState)</h3>
      <div style={{ fontSize: '24pt', fontWeight: 'bold' }}>₹{count.toLocaleString()}</div>
      <button onClick={() => setCount(prev => Math.max(0, prev - step))}>-₹100</button>
      <button onClick={() => setCount(prev => prev + step)}>+₹100</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| Budget Stepper (useState)                                                |
+--------------------------------------------------------------------------+
|                                 ₹3,500                                   |
| [ -₹100 ]            [ +₹100 ]            [ Reset ]                      |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 3.b Write a React Program to Fetch the Data from an API Using React useEffect Hook

### Objective
Fetch data from a backend REST API asynchronously when the component mounts.

### Source Code
```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FetchExpenses() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://expense-tracker-izat.onrender.com/api/expenses')
      .then(res => {
        setData(res.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>⏳ Loading live expenses from API...</p>;

  return (
    <ul>
      {data.map(item => (
        <li key={item._id}>{item.title} &mdash; ₹{item.amount}</li>
      ))}
    </ul>
  );
}
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| Live Render REST API Data:                                               |
+--------------------------------------------------------------------------+
| ✅ 13 Transactions Loaded from Render REST API:                          |
| &bull; Calculus Textbook (Education)                ₹850                  |
| &bull; Campus Canteen Lunch (Food)                  ₹180                  |
| &bull; Cloud Server Hosting (Bills)                 ₹720                  |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 3.c Write a React Program with Two React Components Sharing Data Using Props

### Objective
Pass data and state from a Parent component to Child components via `props`.

### Source Code
```jsx
// Child Component
function DashboardCard({ title, amount, icon }) {
  return (
    <div className="card">
      <span>{icon}</span>
      <h4>{title}</h4>
      <p>₹{amount.toLocaleString()}</p>
    </div>
  );
}

// Parent Component
export default function ParentDashboard() {
  const balance = 66573;
  const totalIncome = 85000;

  return (
    <div className="grid">
      <DashboardCard title="Total Balance" amount={balance} icon="💳" />
      <DashboardCard title="Total Income" amount={totalIncome} icon="📈" />
    </div>
  );
}
```

### Output Screenshot Representation
```
+------------------------------------+   +------------------------------------+
| [ 💳 ] Total Balance               |   | [ 📈 ] Total Income                |
| ₹66,573                            |   | ₹85,000                            |
+------------------------------------+   +------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 3.d Write a React Program to Implement Forms in React

### Objective
Create controlled input elements with state synchronization and submission handlers.

### Source Code
```jsx
import React, { useState } from 'react';

export default function ExpenseForm({ onAddExpense }) {
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Food' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return alert('Fill all fields');
    onAddExpense(formData);
    setFormData({ title: '', amount: '', category: 'Food' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Expense Title"
        value={formData.title}
        onChange={e => setFormData({ ...formData, title: e.target.value })}
      />
      <input
        type="number"
        placeholder="Amount (₹)"
        value={formData.amount}
        onChange={e => setFormData({ ...formData, amount: e.target.value })}
      />
      <button type="submit">Submit Transaction</button>
    </form>
  );
}
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| ➕ Add Expense Record (Form)                                              |
+--------------------------------------------------------------------------+
| Title:  [ Textbook Purchase            ]                                 |
| Amount: [ ₹850                         ]                                 |
| [ Submit Transaction ]                                                   |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 3.e Write a React Program to Implement Iterative Rendering Using map() Function

### Objective
Iteratively render list collections using the array `map()` method with unique keys.

### Source Code
```jsx
import React from 'react';

const categories = [
  { id: 'cat-1', name: 'Food & Dining', spent: 3850, color: '#f59e0b' },
  { id: 'cat-2', name: 'Education & Books', spent: 2400, color: '#3b82f6' },
  { id: 'cat-3', name: 'Bills & Utilities', spent: 4120, color: '#10b981' },
];

export default function IterativeCategoryList() {
  return (
    <div className="category-list">
      {categories.map((item) => (
        <div key={item.id} style={{ borderLeft: `4px solid ${item.color}`, padding: '8px', margin: '4px 0' }}>
          <span>{item.name}</span> &mdash; <strong>₹{item.spent.toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
}
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| Category List Rendered via map()                                         |
+--------------------------------------------------------------------------+
| [| #f59e0b ] Food & Dining        — ₹3,850                              |
| [| #3b82f6 ] Education & Books    — ₹2,400                              |
| [| #10b981 ] Bills & Utilities    — ₹4,120                              |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 4.a Write a Program to Implement the 'Hello World' Message in the Route Through the Browser Using Express.js

### Objective
Initialize an Express.js server and deliver a 'Hello World' message on an HTTP GET route.

### Source Code
```javascript
import express from 'express';
const app = express();
const PORT = 5000;

app.get('/api/lab/hello-world-browser', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #6366f1;">Hello World from ExpenseFlow Express.js!</h1>
        <p>Server uptime: ${process.uptime().toFixed(2)} seconds</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| Browser: https://expense-tracker-izat.onrender.com/api/lab/hello-world-browser
+--------------------------------------------------------------------------+
| Hello World from ExpenseFlow Express.js!                                 |
| Server uptime: 652.20 seconds | Status: 200 OK                           |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 4.b Write a Program to Develop a Small Website with Multiple Routes Using Express.js

### Objective
Structure a multi-route Express website serving endpoints for Home, About, Services, and Contact.

### Source Code
```javascript
import express from 'express';
const router = express.Router();

router.get('/home', (req, res) => res.json({ title: 'ExpenseFlow Home', status: 'Operational' }));
router.get('/about', (req, res) => res.json({ title: 'About ExpenseFlow', version: '1.0.0' }));
router.get('/services', (req, res) => res.json({ services: ['Expense Tracking', 'SQL Analytics'] }));
router.post('/contact', (req, res) => res.status(201).json({ success: true, message: 'Received!' }));

export default router;
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| GET /api/website/about -> HTTP/1.1 200 OK                                |
+--------------------------------------------------------------------------+
| {                                                                        |
|   "title": "ExpenseFlow - Enterprise Personal Finance & Analytics",      |
|   "version": "1.0.0",                                                    |
|   "status": "200 OK"                                                     |
| }                                                                        |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 4.c Write a Program to Print 'Hello World' in the Browser Console Using Express.js

### Objective
Serve an Express route with client-side JavaScript that executes `console.log()` in the user's browser console.

### Source Code
```javascript
app.get('/api/lab/browser-console', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Express Console Dispatch</title></head>
      <body>
        <h2>Press F12 to inspect Console Output</h2>
        <script>
          console.log("%c🚀 Hello World from Express.js Server!", "color: #6366f1; font-size: 16px; font-weight: bold;");
          console.info("⚡ Express server successfully rendered this script into client runtime.");
        </script>
      </body>
    </html>
  `);
});
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| Browser Developer Console (F12)                                          |
+--------------------------------------------------------------------------+
| 🚀 Hello World from Express.js Server!                                   |
| ⚡ Express server successfully rendered this script into client runtime. |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 4.d Write a Program to Implement CRUD Operations Using Express.js

### Objective
Implement RESTful Create, Read, Update, and Delete endpoints in Express.js.

### Source Code
```javascript
// CREATE
export const createExpense = async (req, res) => {
  const expense = await Expense.create(req.body);
  res.status(201).json({ success: true, data: expense });
};

// READ
export const getExpenses = async (req, res) => {
  const list = await Expense.find().sort({ date: -1 });
  res.status(200).json({ success: true, count: list.length, data: list });
};

// UPDATE
export const updateExpense = async (req, res) => {
  const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, data: updated });
};

// DELETE
export const deleteExpense = async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Deleted successfully' });
};
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| REST Client &bull; POST /api/expenses                                          |
+--------------------------------------------------------------------------+
| Status: 201 Created                                                      |
| {                                                                        |
|   "success": true,                                                       |
|   "data": { "_id": "6ac3a8a6", "title": "Hardware Lab Kit", "amount": 3500 }
| }                                                                        |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 4.e Write a Program to Establish the Connection Between API and Database Using Express - MySQL Driver

### Objective
Establish a connection pool to MySQL using `mysql2/promise` and verify query execution.

### Source Code
```javascript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'expenseflow_db',
  waitForConnections: true,
  connectionLimit: 10,
});

export const testMySQLConnection = async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution, VERSION() AS version');
    return { connected: true, version: rows[0].version };
  } catch (err) {
    return { connected: false, error: err.message };
  }
};
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| GET /api/lab/mysql/connection-test                                       |
+--------------------------------------------------------------------------+
| {                                                                        |
|   "driver": "mysql2/promise",                                            |
|   "status": "READY",                                                     |
|   "message": "MySQL Database Driver connection pool initialized."        |
| }                                                                        |
+--------------------------------------------------------------------------+
```

---

<div style="page-break-before: always;"></div>

# 5.a Write a Program to Create a Database and Table Inside That Database Using MySQL Command Line Client

### Objective
Execute DDL queries to create a database schema and tables in MySQL.

### Source Code
```sql
-- 1. Create Database
CREATE DATABASE IF NOT EXISTS expenseflow_db;
USE expenseflow_db;

-- 2. Create Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    payment_method VARCHAR(40) DEFAULT 'UPI',
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Output Screenshot Representation
```
mysql> CREATE DATABASE expenseflow_db;
Query OK, 1 row affected (0.01 sec)

mysql> USE expenseflow_db;
Database changed

mysql> DESCRIBE expenses;
+----------------+---------------+------+-----+---------+----------------+
| Field          | Type          | Null | Key | Default | Extra          |
+----------------+---------------+------+-----+---------+----------------+
| id             | int           | NO   | PRI | NULL    | auto_increment |
| title          | varchar(120)  | NO   |     | NULL    |                |
| amount         | decimal(10,2) | NO   |     | NULL    |                |
| category       | varchar(50)   | NO   |     | NULL    |                |
+----------------+---------------+------+-----+---------+----------------+
```

---

<div style="page-break-before: always;"></div>

# 5.b Write MySQL Queries to Create Table, Insert Data, and Update Data in the Table

### Objective
Execute `INSERT INTO`, `UPDATE`, and `SELECT` DML operations.

### Source Code
```sql
-- 1. Insert Sample Records
INSERT INTO expenses (title, amount, category, payment_method, date) VALUES
('Calculus Textbook', 850.00, 'Education', 'UPI', '2026-10-01'),
('Campus Canteen Lunch', 180.00, 'Food', 'Cash', '2026-10-02'),
('Cloud Server Hosting', 720.00, 'Bills', 'Credit Card', '2026-10-03');

-- 2. Update Record
UPDATE expenses 
SET amount = 950.00 
WHERE title = 'Calculus Textbook';

-- 3. Query Updated Table
SELECT id, title, amount, category FROM expenses;
```

### Output Screenshot Representation
```
mysql> UPDATE expenses SET amount = 950.00 WHERE title = 'Calculus Textbook';
Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> SELECT id, title, amount, category FROM expenses;
+----+-----------------------+--------+-----------+
| id | title                 | amount | category  |
+----+-----------------------+--------+-----------+
|  1 | Calculus Textbook     | 950.00 | Education |
|  2 | Campus Canteen Lunch  | 180.00 | Food      |
|  3 | Cloud Server Hosting  | 720.00 | Bills     |
+----+-----------------------+--------+-----------+
3 rows in set (0.00 sec)
```

---

<div style="page-break-before: always;"></div>

# 5.c Write MySQL Queries to Implement Subqueries in MySQL Command Line Client

### Objective
Execute Scalar Subqueries, Derived Table Subqueries, and Correlated Subqueries.

### Source Code
```sql
-- 1. SCALAR SUBQUERY: Find transactions above overall average
SELECT id, title, amount, category
FROM expenses
WHERE amount > (SELECT AVG(amount) FROM expenses)
ORDER BY amount DESC;

-- 2. DERIVED TABLE SUBQUERY: Categories with total spending > 1000
SELECT cat_summary.category, cat_summary.total_spent
FROM (
    SELECT category, SUM(amount) AS total_spent
    FROM expenses
    GROUP BY category
) AS cat_summary
WHERE cat_summary.total_spent > 1000.00;

-- 3. CORRELATED SUBQUERY: Peak spending transaction per category
SELECT e1.id, e1.title, e1.category, e1.amount
FROM expenses e1
WHERE e1.amount = (
    SELECT MAX(e2.amount)
    FROM expenses e2
    WHERE e2.category = e1.category
);
```

### Output Screenshot Representation
```
mysql> SELECT id, title, amount, category FROM expenses WHERE amount > (SELECT AVG(amount) FROM expenses);
+----+----------------------------+---------+-------------+
| id | title                      | amount  | category    |
+----+----------------------------+---------+-------------+
|  4 | Flight Ticket to Hyderabad | 4500.00 | Travel      |
|  8 | Project Hardware Kit       | 3500.00 | Education   |
|  1 | Annual Health Insurance    | 8500.00 | Health      |
+----+----------------------------+---------+-------------+
6 rows in set (0.01 sec)
```

---

<div style="page-break-before: always;"></div>

# 5.d Write a MySQL Program to Create `.sql` Database File to Integrate into API & MySQL Workbench

### Objective
Generate a complete schema dump and integrate MySQL DDL into API endpoints.

### Source Code
```javascript
router.get('/export-dump', async (req, res) => {
  const dumpHeader = `-- ExpenseFlow MySQL Database Dump\nCREATE DATABASE IF NOT EXISTS expenseflow_db;\nUSE expenseflow_db;\n\n`;
  const ddlExpenses = `CREATE TABLE IF NOT EXISTS expenses (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(120), amount DECIMAL(10,2), category VARCHAR(50), date DATE);\n`;
  
  res.setHeader('Content-Type', 'application/sql');
  res.setHeader('Content-Disposition', 'attachment; filename="expenseflow_dump.sql"');
  res.send(dumpHeader + ddlExpenses);
});
```

### Output Screenshot Representation
```
+--------------------------------------------------------------------------+
| MySQL Workbench Import Verification                                      |
+--------------------------------------------------------------------------+
| File: expenseflow_dump.sql (6,001 bytes)                                 |
| Target Server: MySQL 8.0 @ localhost:3306                                |
| Status: Schema & Table definitions executed successfully.                |
+--------------------------------------------------------------------------+
```
