import Expense from '../models/Expense.js';
import Income from '../models/Income.js';

// @desc    Get complete dashboard summary metrics
// @route   GET /api/dashboard/summary
export const getDashboardSummary = async (req, res, next) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Start & End of current month
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

    // Run parallel aggregation & queries
    const [
      allExpenses,
      allIncome,
      monthExpensesAgg,
      categoryAgg,
      paymentMethodAgg,
      recentExpenses,
    ] = await Promise.all([
      // Total expenses sum
      Expense.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
      // Total income sum
      Income.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
      // Current month expenses sum
      Expense.aggregate([
        {
          $match: {
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
      // Category Breakdown
      Expense.aggregate([
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),
      // Payment Method Breakdown
      Expense.aggregate([
        {
          $group: {
            _id: '$paymentMethod',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),
      // Recent 5 expenses
      Expense.find().sort({ date: -1, createdAt: -1 }).limit(5),
    ]);

    const totalExpenses = allExpenses.length > 0 ? allExpenses[0].totalAmount : 0;
    const totalIncome = allIncome.length > 0 ? allIncome[0].totalAmount : 0;
    const currentMonthExpenses =
      monthExpensesAgg.length > 0 ? monthExpensesAgg[0].totalAmount : 0;
    const totalBalance = totalIncome - totalExpenses;

    // Format Category Breakdown with percentage
    const categoryTotals = categoryAgg.map((item) => ({
      category: item._id,
      amount: item.total,
      count: item.count,
      percentage: totalExpenses > 0 ? Math.round((item.total / totalExpenses) * 100) : 0,
    }));

    // Format Payment Method Breakdown
    const paymentMethodTotals = paymentMethodAgg.map((item) => ({
      paymentMethod: item._id,
      amount: item.total,
      count: item.count,
    }));

    // Calculate Monthly breakdown for the last 6 months
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const mYear = d.getFullYear();
      const mMonth = d.getMonth();
      const mStart = new Date(mYear, mMonth, 1);
      const mEnd = new Date(mYear, mMonth + 1, 0, 23, 59, 59, 999);
      const label = `${monthNames[mMonth]} ${mYear.toString().slice(-2)}`;

      const [expAgg, incAgg] = await Promise.all([
        Expense.aggregate([
          { $match: { date: { $gte: mStart, $lte: mEnd } } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Income.aggregate([
          { $match: { date: { $gte: mStart, $lte: mEnd } } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
      ]);

      const exp = expAgg.length > 0 ? expAgg[0].total : 0;
      const inc = incAgg.length > 0 ? incAgg[0].total : 0;

      monthlyTrends.push({
        month: label,
        expense: exp,
        income: inc,
        savings: inc - exp,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalBalance,
          totalIncome,
          totalExpenses,
          currentMonthExpenses,
          expenseCount: allExpenses.length > 0 ? allExpenses[0].count : 0,
          incomeCount: allIncome.length > 0 ? allIncome[0].count : 0,
          savingsRate:
            totalIncome > 0
              ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100))
              : 0,
        },
        categoryTotals,
        paymentMethodTotals,
        monthlyTrends,
        recentExpenses,
      },
    });
  } catch (error) {
    next(error);
  }
};
