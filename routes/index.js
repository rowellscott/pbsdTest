var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();
//hello
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
  Expense.find({})
    .populate("ProjectId", "Name")
    .sort({ Date: -1 })
    .sort({ CustomerName: 1 })
    .sort({ ProjectName: 1 })
    .sort({ Amount: 1 })
    .exec((err, expenses) => {
      if (err) {
        res.status(500).json({ message: "Error Retrieving Expenses" });
      }

      res.status(200).json(expenses);
    });
});

//Get Expense Details Route
router.get("/expense/:id", (req, res, next) => {
  Expense.findById(req.params.id)
    .populate("ProjectId", "Name")
    .exec((err, expense) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Expense Not Found" });
        return;
      }

      res.status(200).json(expense);
    });
});

//Get All Customers
router.get("/customers", (req, res, next) => {
  Customer.find()
    .sort({ Name: 1 })
    .exec((err, customers) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Customers Not Found" });
        return;
      }

      res.status(200).json(customers);
    });
});

//Get All Projects For A Specific Customer
router.get("/projects/:customerId", (req, res, next) => {
  Project.find({ CustomerId: req.params.customerId }, "Name")
    .sort({ Name: 1 })
    .exec((err, projects) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Customers Not Found" });
        return;
      }

      res.status(200).json(projects);
    });
});

//Add An Expense
router.post("/add", (req, res, next) => {
  console.log(req.body);
  if (req.body.newCustomerName === "") {
    res.status(500).json({ message: "Please Select A Customer" });
    return;
  }
  if (req.body.newProjectName === "") {
    res.status(500).json({ message: "Please Select A Project" });
    return;
  } //

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

          // let newAmount = validateAmount(req.body.newAmount, res);

          const newExpense = new Expense({
            ProjectId: project._id,
            Date: req.body.newDate,
            CustomerName: req.body.newCustomerName,
            Name: req.body.newName,
            Amount: req.body.newAmount.toFixed(2),
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

  Project.findOne({ Name: req.body.editProjectName }, "_id", (err, project) => {
    if (err || project == null) {
      res
        .status(500)
        .json({ message: "Project Doesn't Exist for this Customer" });
      return;
    }

    let editAmount = validateAmount(req.body.editAmount, res);

    const updates = {
      Date: req.body.editDate,
      CustomerName: req.body.editCustomerName,
      ProjectId: project._id,
      Name: req.body.editName,
      Amount: editAmount,
      Description: req.body.editDescription
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

router.delete("/delete/:id", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid." });
    return;
  }

  Expense.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.json(err);
      return;
    }
  });

  res.json({
    message: "Expense Removed From Database"
  });
});

module.exports = router;
