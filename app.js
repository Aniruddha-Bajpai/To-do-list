// require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
//"mongodb+srv://admin-aniruddha:Test123@cluster0.0kwfduw.mongodb.net/todolistDB"
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});
const itemSchema = new mongoose.Schema({
  name: String,
});
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema],
});
const List = new mongoose.model("List", listSchema);
const Item = new mongoose.model("Item", itemSchema);
// let StartList = [];
// let workList = [];
// Creating 3 new documents for dummy data
const item1 = new Item({
  name: "Welcome to your todolist!",
});
const item2 = new Item({
  name: "Hit the + button to aff a new line",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});
const defaultItems = [item1, item2, item3];
// deletes all the data inside the collection items
// Item.deleteMany({}).then(console.log);

// ========> get the page on visit
app.get("/", function (req, res) {
  Item.find({})
    .catch(console.err)
    .then(function (foundItem) {
      if (foundItem.length == 0) {
        Item.insertMany(defaultItems)
          .catch(console.err)
          .then(console.log)
          .finally(() => console.log("Done!"));
        res.redirect("/");
      } else {
        res.render("tolist", { TitleName: "Today", lists: foundItem });
      }
    });
});
// ===========> post request by client
app.post("/", function (req, res) {
  const listItem = req.body.listItem;
  const listName = req.body.list;
  const newItem = new Item({
    name: listItem,
  });
  if (listName == "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName })
      .catch(console.err)
      .then((foundList) => {
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/" + listName);
      });
  }
  // if (req.body.listName === "Work") {
  //   workList.push(req.body.listItem);
  //   res.redirect("/work");
  // } else {
  //   StartList.push(req.body.listItem);
  //   res.redirect("/");
  // }
});
// DELETE ROUTE
app.post("/delete", function (req, res) {
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemID).catch(console.err).then(console.log);
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemID } } }
    )
      .catch(console.err)
      .then(res.redirect("/" + listName));
  }
});

app.get("/:page_name", function (req, res) {
  const customListName = _.capitalize(req.params.page_name);
  List.findOne({ name: customListName })
    .catch(console.err)
    .then(function (foundList) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("tolist", {
          TitleName: foundList.name,
          lists: foundList.items,
        });
      }
    });
});
app.get("/about", function (req, res) {
  res.render("about", { TitleName: "About" });
});
// const port = process.env.PORT;
app.listen(3000, function () {
  console.log("Server is up and running !");
});
