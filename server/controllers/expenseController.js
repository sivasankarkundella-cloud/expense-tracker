import Expense from '../models/Expense.js';

// @desc    Get all expenses with optional filters, search, and sorting
// @route   GET /api/expenses
export const getExpenses = async (req, res, next) => {
  try {
    const {
      category,
      paymentMethod,
      startDate,
      endDate,
      search,
      sort = 'newest',
      limit,
    } = req.query;

    const query = {};

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by Payment Method
    if (paymentMethod && paymentMethod !== 'All') {
      query.paymentMethod = paymentMethod;
    }

    // Filter by Date Range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Search by title, category, or description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
        { paymentMethod: searchRegex },
      ];
    }

    // Sorting options
    let sortOptions = { date: -1, createdAt: -1 }; // default: newest first
    if (sort === 'oldest') {
      sortOptions = { date: 1, createdAt: 1 };
    } else if (sort === 'amount_desc') {
      sortOptions = { amount: -1 };
    } else if (sort === 'amount_asc') {
      sortOptions = { amount: 1 };
    }

    let queryExec = Expense.find(query).sort(sortOptions);
    if (limit && !isNaN(parseInt(limit))) {
      queryExec = queryExec.limit(parseInt(limit));
    }

    const expenses = await queryExec;
    const totalCount = await Expense.countDocuments(query);

    // Calculate sum for current filtered results
    const totalFilteredAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    res.status(200).json({
      success: true,
      count: expenses.length,
      totalCount,
      totalFilteredAmount,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single expense by ID
// @route   GET /api/expenses/:id
export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: `Expense not found with id: ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
export const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, paymentMethod, description } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, amount, and category',
      });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a number greater than 0',
      });
    }

    const expense = await Expense.create({
      title: title.trim(),
      amount: parsedAmount,
      category,
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'UPI',
      description: description ? description.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing expense
// @route   PUT /api/expenses/:id
export const updateExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, paymentMethod, description } = req.body;

    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: `Expense not found with id: ${req.params.id}`,
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (amount !== undefined) {
      const parsed = parseFloat(amount);
      if (isNaN(parsed) || parsed <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a number greater than 0',
        });
      }
      updateData.amount = parsed;
    }
    if (category !== undefined) updateData.category = category;
    if (date !== undefined) updateData.date = new Date(date);
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (description !== undefined) updateData.description = description.trim();

    expense = await Expense.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: `Expense not found with id: ${req.params.id}`,
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
