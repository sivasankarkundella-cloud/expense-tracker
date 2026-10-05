import Expense from './models/Expense.js';
import Income from './models/Income.js';

export const sampleExpenses = [
  {
    title: 'Grocery Store & Fresh Veggies',
    amount: 3450,
    category: 'Food',
    paymentMethod: 'UPI',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    description: 'Weekly organic groceries, vegetables, and milk',
  },
  {
    title: 'Electricity & Broadband Bill',
    amount: 2200,
    category: 'Bills',
    paymentMethod: 'Debit Card',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    description: 'Monthly electricity bill & high-speed internet',
  },
  {
    title: 'Metro SmartCard & Fuel',
    amount: 1500,
    category: 'Transport',
    paymentMethod: 'UPI',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    description: 'Metro smartcard recharge and petrol for scooter',
  },
  {
    title: 'Web Dev Mastery Book & Udemy Course',
    amount: 1899,
    category: 'Education',
    paymentMethod: 'Credit Card',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    description: 'Full stack development tutorial and reference textbook',
  },
  {
    title: 'Weekend Dinner with Friends',
    amount: 1850,
    category: 'Food',
    paymentMethod: 'UPI',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    description: 'Italian pizza & dessert at cafe',
  },
  {
    title: 'Gym Membership & Whey Protein',
    amount: 2800,
    category: 'Health',
    paymentMethod: 'UPI',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    description: 'Monthly fitness center renewal and vitamins',
  },
  {
    title: 'Clothing & Casual Shoes',
    amount: 3200,
    category: 'Shopping',
    paymentMethod: 'Credit Card',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    description: 'Sale discount on shirts and running sneakers',
  },
  {
    title: 'Cinema IMAX Movie Tickets',
    amount: 950,
    category: 'Entertainment',
    paymentMethod: 'Debit Card',
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    description: '2x IMAX 3D tickets with popcorn combo',
  },
  {
    title: 'Weekend Getaway Train Ticket',
    amount: 1450,
    category: 'Travel',
    paymentMethod: 'Bank Transfer',
    date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
    description: 'Express train tickets for hill station trip',
  },
  {
    title: 'Mobile Phone Recharge',
    amount: 749,
    category: 'Bills',
    paymentMethod: 'UPI',
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    description: '84 days unlimited 5G plan',
  },
  {
    title: 'Stationery & Project Notebooks',
    amount: 450,
    category: 'Education',
    paymentMethod: 'Cash',
    date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    description: 'Spiral journals, drawing pens and markers',
  },
  {
    title: 'Coffee & Snacks at Campus',
    amount: 280,
    category: 'Food',
    paymentMethod: 'UPI',
    date: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
    description: 'Cappuccino & club sandwich',
  },
  {
    title: 'Spotify & Netflix Subscription',
    amount: 649,
    category: 'Entertainment',
    paymentMethod: 'Credit Card',
    date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    description: 'Monthly streaming plans',
  },
];

export const sampleIncome = [
  {
    title: 'Monthly Main Salary',
    source: 'Salary',
    amount: 55000,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    description: 'Software Engineer monthly stipend / salary credited',
  },
  {
    title: 'Freelance Web Design Project',
    source: 'Freelance',
    amount: 18000,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    description: 'Landing page design & branding milestone payment',
  },
  {
    title: 'Merit Academic Scholarship',
    source: 'Scholarship',
    amount: 10000,
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    description: 'College semester performance scholarship grant',
  },
  {
    title: 'Birthday Gift from Family',
    source: 'Gift',
    amount: 5000,
    date: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
    description: 'Celebration monetary gift',
  },
];

export const seedDatabase = async () => {
  await Expense.deleteMany({});
  await Income.deleteMany({});

  const insertedExpenses = await Expense.insertMany(sampleExpenses);
  const insertedIncome = await Income.insertMany(sampleIncome);

  return {
    expenseCount: insertedExpenses.length,
    incomeCount: insertedIncome.length,
  };
};
