import mongoose from 'mongoose';

const incomeSources = [
  'Salary',
  'Freelance',
  'Scholarship',
  'Gift',
  'Investment',
  'Business',
  'Other',
];

const incomeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an income title or source description'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    source: {
      type: String,
      required: [true, 'Please select an income source'],
      enum: {
        values: incomeSources,
        message: '{VALUE} is not a valid income source',
      },
      default: 'Salary',
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

incomeSchema.index({ date: -1 });

const Income = mongoose.model('Income', incomeSchema);

export { incomeSources };
export default Income;
