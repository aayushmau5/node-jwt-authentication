const express = require("express");
const mongoose = require("mongoose");
const app = express();
const router = require("./routes/route");
const cookieParser = require("cookie-parser");

require("dotenv").config();

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "pug");
app.use(cookieParser());

mongoose.connect(process.env.mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

app.use(router);

app.listen(3000);
