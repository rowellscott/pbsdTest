const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  CustomerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Customer"
  },
  Name: {
    type: String,
    required: true
  }
});

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
