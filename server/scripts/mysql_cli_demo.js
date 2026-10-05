/**
 * Standalone Node.js script demonstrating Express - MySQL Driver integration
 * and SQL queries including CRUD & Subqueries.
 * Run via: node server/scripts/mysql_cli_demo.js
 */

import { testMySQLConnection, executeMySQLQuery } from '../config/mysqlDb.js';

async function runDemo() {
  console.log('====================================================');
  console.log('💳 ExpenseFlow: MySQL & Express Integration Demo');
  console.log('====================================================\n');

  console.log('🔍 1. Testing Express - MySQL Driver Connection...');
  const connStatus = await testMySQLConnection();
  console.log('Result:', connStatus);

  if (!connStatus.connected) {
    console.log('\n💡 Note: Local MySQL server is offline. Standard SQL script is available at server/database/schema.sql');
    console.log('To run on MySQL CLI:');
    console.log('  mysql -u root -p < server/database/schema.sql\n');
    return;
  }

  console.log('\n📊 2. Executing Scalar Subquery: Find expenses above average');
  const subquerySql = `
    SELECT id, title, amount, category
    FROM expenses
    WHERE amount > (SELECT AVG(amount) FROM expenses)
    ORDER BY amount DESC;
  `;
  const subqueryResult = await executeMySQLQuery(subquerySql);
  console.table(subqueryResult.data);

  console.log('\n📈 3. Executing Derived Table Subquery: Category Totals > 1000');
  const derivedSql = `
    SELECT cat_summary.category, cat_summary.total_spent
    FROM (
        SELECT category, SUM(amount) AS total_spent
        FROM expenses
        GROUP BY category
    ) AS cat_summary
    WHERE cat_summary.total_spent > 1000
    ORDER BY cat_summary.total_spent DESC;
  `;
  const derivedResult = await executeMySQLQuery(derivedSql);
  console.table(derivedResult.data);
}

runDemo().catch(console.error);
