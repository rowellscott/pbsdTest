var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();

const Customer = require("../models/Customer-Model");
const Expense = require("../models/Expense-Model");
const Project = require("../models/Project-Model");

/* Get All Expenses for Listing Form */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Hello World" });
});

router.post("/add", (req, res, next) => {
  Customer.findOne({"Name": "Customer A"}, (err, customers) => {
    console.log(customers)
  })

  Customer.findOne({ "Name": req.body.newCustomerName }, (err, customer) => {
    console.log(customer),
    console.log(req.body.newCustomerName)
    if (err) {
      res.status(500).json({ message: "Customer Not Found" });
      return;
    }

    Project.find({ CustomerId: customer._id }, (err, projects) => {
      if (err) {
        res.status(500).json({ message: "Customer Has No Projects" });
        return;
      }
      //Find ProjectId of the Project That Adding Expense To
      Project.findOne(
        { Name: req.body.newProjectName },
        "_id",
        (err, project) => {
          if (err) {
            res
              .status(500)
              .json({ message: "Project Doesn't Exist for this Customer" });
            return;
          }

          const newExpense = new Expense({
            ProjectId: project._id,
            Date: req.body.newDate,
            CustomerName: req.body.newCustomerName,
            Name: req.body.newName,
            Amount: req.body.newAmount,
            Description: req.body.newDescription
          });

          newExpense.save(err => {
            if (err) {
              res.status(500).json({ message: "Error Saving User" });
              return;
            }
            res.status(200).json(newExpense);
          });
        }
      );
    });
  });
});

module.exports = router;
