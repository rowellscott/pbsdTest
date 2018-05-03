var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();

const Customer = require("../models/Customer-Model");
const Expense = require("../models/Expense-Model");
const Project = require("../models/Project-Model");

function validateAmount(amount, res) {
  //Confirm Amount is a Number
  let newAmount = Number(amount);

  //Cast the Number to Two Decimal Places
  let newAmountTwo = newAmount.toFixed(2);

  //Validate Number Matches #,###.00 Format
  if (newAmountTwo > 9999.99 || newAmountTwo < 0) {
    res.status(500).json({ message: "Invalid Number" });
    return;
  }
  return newAmountTwo;
}

/* Get All Expenses for Listing Form */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Hello World" });
});

router.post("/add", (req, res, next) => {
  Customer.findOne({ Name: req.body.newCustomerName }, (err, customer) => {
    // console.log(customer)
    if (err) {
      console.log(err);
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

          let newAmount = validateAmount(req.body.newAmount, res);

          const newExpense = new Expense({
            ProjectId: project._id,
            Date: req.body.newDate,
            CustomerName: req.body.newCustomerName,
            Name: req.body.newName,
            Amount: newAmount,
            Description: req.body.newDescription
          });

          newExpense.save(err => {
            if (err) {
              console.log(err);
              res.status(500).json({ message: err.message });
              return;
            }
            res.status(200).json(newExpense);
          });
        }
      );
    });
  });
});

router.put("/edit/:id", (req, res, next) => {
  //Validate req.params.id is Mongoose ObjectID Type
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findOne({ Name: req.body.newProjectName }, "_id", (err, project) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Project Doesn't Exist for this Customer" });
      return;
    }

    let newAmount = validateAmount(req.body.newAmount, res);

    const updates = {
      Date: req.body.newDate,
      CustomerName: req.body.newCustomerName,
      ProjectId: project._id,
      Name: req.body.newName,
      Amount: newAmount,
      Description: req.body.newDescription
    };

    Expense.findByIdAndUpdate(req.params.id, updates, err => {
      if (err) {
        res.status(500).json(err);
      }

      res.json({
        message: "Update Successful!"
      });
    });
  });
});

module.exports = router;
