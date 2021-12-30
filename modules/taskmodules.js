const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    HwID: {
      type: String,
      require: "HwID cannot be blank",
    },
    User: {
      type: String,
      require: "User cannot be blank",
    },
    TypeData: {
      type: String,
      require: "TypeData cannot be blank",
    },
  },
  { collaction: "Task" }
);
module.exports = mongoose.model("Task", taskSchema);
