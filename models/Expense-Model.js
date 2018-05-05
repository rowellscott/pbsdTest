const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  ProjectId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Project"
  },
  Date: {
    type: Date,
    default: Date.now,
    required: true
  },
  CustomerName: {
    type: String,
    required: true
  },
  Name: {
    type: String,
    required: true,
    maxlength: 100
  },
  Amount: {
    type: Schema.Types.Decimal128,
    min: 0.0,
    max: 9999.99,
    required: true
  },
  Description: {
    type: String,
    maxlength: 350
  }
});

const Expense = mongoose.model("Expense", ExpenseSchema);
module.exports = Expense;
