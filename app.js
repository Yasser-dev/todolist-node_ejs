//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const taskSchema = {
  name: String
};
const listSchema = {
  name: String,
  tasks: [taskSchema]
};

const Task = mongoose.model("Task", taskSchema);
const List = mongoose.model("List", listSchema);

const task1 = new Task({
  name: "This is task 1"
});
const task2 = new Task({
  name: "This is task 2"
});
const task3 = new Task({
  name: "This is task 3"
});
var defaultTasks = [task1, task2, task3];


app.set("view engine", "ejs");

app.get("/", (req, res) => {
  Task.find({}, (err, foundTasks) => {
    if (foundTasks.length === 0) {
      Task.insertMany(defaultTasks, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("successfuly inserted default tasks");
        }
        res.redirect("/");
      });
    } else if (err) {
      console.log(err);
    } else
      res.render("list", {
        Day: day,
        tasksList: foundTasks
      });
  });
  const day = date.getDate();

});

app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName;

  List.findOne({
    name: customListName
  }, (err, foundList) => {
    if (err) {
      console.log(err);
    } else {
      if (!foundList) {
        const list = new List({
          name: customListName,
          tasks: defaultTasks
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("customList", {
          ListTitle: foundList.name,
          tasksList: foundList.tasks
        });
      }
    }
  });


});

app.post("/", (req, res) => {
  const taskName = req.body.newItem;
  const task = new Task({
    name: taskName
  }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('New task added');
    }
  });
  task.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const checkedItemID = req.body.checkbox;
  Task.findByIdAndRemove(checkedItemID, (err) => {
    if (err) {
      console.log(err);
    } else console.log("Task id: " + checkedItemID + " deleted");
  });
  res.redirect("/");
});

app.listen(process.env.PORT || 3000);