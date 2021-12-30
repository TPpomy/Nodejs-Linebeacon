const mongoose = require("mongoose");
const task = mongoose.model("Task");

exports.list_all_task = (req, res) => {
  task.find({}, (err, res) => {
    if (err) res.send(err);
    res.json(task);
  });
};
exports.create_a_task = (req, res) => {
  const newTask = new task(req.boby);
  newTask.save((err, res) => {
    if (err) res.send(err);
    res.json(task);
  });
};
exports.read_a_task = (req, res) => {
  task.findById(raq.params.taskId, (err, task) => {
    if (err) res.send(err);
    res.json(task);
  });
};
exports.update_a_task = (req, res) => {
  task.findOneAndUpdate(
    { _id: req.params.taskId },
    req.boby,
    { new: true },
    (err, task) => {
      if (err) res.send(err);
      res.json(task);
    }
  );
};
exports.delete_a_task = (req, res) => {
  task.deleteOne({ _id: req.params.task }, (err) => {
    if (err) res.send(err);
    res.json({
      message: "Task deleted successfully",
      _id: req.params.taskId,
    });
  });
};
