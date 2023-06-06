const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/customer");

const dotenv = require("dotenv");
require("dotenv").config();

//connecting to mongodb database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connection succesful");
  });

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.use(customerRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
