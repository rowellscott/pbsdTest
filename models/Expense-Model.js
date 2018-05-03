const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  ProjectId: {
    type: Schema.Types.ObjectId,
    required: true
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
    type: Number,
    validate: {
      validator: function(v) {
        return /\d{4}.\d{2}/.test(v);
      },
      message: "{VALUE] Is Not A Valid Number!"
    },
    required: true
  },
  Description: {
    type: String,
    maxlength: 350
  }
});

const Expense = mongoose.model("Expense", ExpenseSchema);
module.exports = Expense;
