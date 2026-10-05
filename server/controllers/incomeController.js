import Income from '../models/Income.js';

// @desc    Get all income records
// @route   GET /api/income
export const getAllIncome = async (req, res, next) => {
  try {
    const { source, sort = 'newest' } = req.query;
    const query = {};

    if (source && source !== 'All') {
      query.source = source;
    }

    let sortOptions = { date: -1, createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { date: 1, createdAt: 1 };
    } else if (sort === 'amount_desc') {
      sortOptions = { amount: -1 };
    } else if (sort === 'amount_asc') {
      sortOptions = { amount: 1 };
    }

    const incomeList = await Income.find(query).sort(sortOptions);
    const totalIncomeAmount = incomeList.reduce((acc, curr) => acc + curr.amount, 0);

    res.status(200).json({
      success: true,
      count: incomeList.length,
      totalIncomeAmount,
      data: incomeList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single income by ID
// @route   GET /api/income/:id
export const getIncomeById = async (req, res, next) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({
        success: false,
        message: `Income record not found with id: ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new income record
// @route   POST /api/income
export const createIncome = async (req, res, next) => {
  try {
    const { title, source, amount, date, description } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an income amount',
      });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a number greater than 0',
      });
    }

    const income = await Income.create({
      title: (title || source || 'Income').trim(),
      source: source || 'Salary',
      amount: parsedAmount,
      date: date ? new Date(date) : new Date(),
      description: description ? description.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Income added successfully',
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update income record
// @route   PUT /api/income/:id
export const updateIncome = async (req, res, next) => {
  try {
    const { title, source, amount, date, description } = req.body;

    let income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({
        success: false,
        message: `Income record not found with id: ${req.params.id}`,
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (source !== undefined) updateData.source = source;
    if (amount !== undefined) {
      const parsed = parseFloat(amount);
      if (isNaN(parsed) || parsed <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than 0',
        });
      }
      updateData.amount = parsed;
    }
    if (date !== undefined) updateData.date = new Date(date);
    if (description !== undefined) updateData.description = description.trim();

    income = await Income.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Income record updated successfully',
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete income record
// @route   DELETE /api/income/:id
export const deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({
        success: false,
        message: `Income record not found with id: ${req.params.id}`,
      });
    }

    await Income.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Income record deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
