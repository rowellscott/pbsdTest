const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  Name: {
    type: String,
    required: true
  }
});

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
