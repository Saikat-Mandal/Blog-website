const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

// setting view engine
app.set("view engine", "ejs");

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

////////////////////////// database setup ///////////////////////////////////////////

mongoose.connect("mongodb://0.0.0.0:27017/blogsDB", (err) => {
  if (!err) console.log("succesfully connected to database");
});

// creating schema
const blogSchema = {
  title: String,
  body: String,
};

const Blog = new mongoose.model("blog", blogSchema);

const p =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not on , Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not on";

const c =
  "er since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not on";

const a =
  "dustry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not on";

/////////////////////// GET ROUTES /////////////////////////////

// home route
app.get("/", (req, res) => {
  Blog.find({}, (err, blogs) => {
    res.render("home", { para: p, postArray: blogs });
  });
});
// about
app.get("/about", (req, res) => {
  res.render("about", { para: a });
});
// contact
app.get("/contact", (req, res) => {
  res.render("contact", { para: c });
});
// compose
app.get("/compose", (req, res) => {
  res.render("compose", { para: c });
});

//dynamic route
app.get("/posts/:postId", (req, res) => {
  const reqTitle = req.params.postId;

  Blog.findOne({ _id: reqTitle }, (err, blog) => {
    if (!err) {
      res.render("post", { t: blog.title, p: blog.body });
    } else {
      res.redirect("/");
    }
  });
});

/////////////////////////// POST ROUTES //////////////////////////////////

app.post("/compose", (req, res) => {
  const blog = new Blog({
    title: req.body.postTitle,
    body: req.body.postBody,
  });

  blog.save((err) => {
    if (!err) res.redirect("/");
  });
});

app.listen(3000, console.log("listning to port 3000"));
