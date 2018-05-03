const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/pbsd-Test");

const Customer = require("../models/Customer-Model");

const customers = [
  {
    Name: "Customer A"
  },
  {
    Name: "Customer B"
  },
  {
    Name: "Customer C"
  },
  {
    Name: "Custoemr D"
  },
  {
    Name: "Customer E"
  }
];

Customer.create(customers, (err, docs) => {
  if (err) {
    throw err;
  }

  mongoose.connection.close();
});
