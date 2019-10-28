const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const app = express();
const keys = require("./config/keys"); //importing keys for database connection
const fs = require("fs");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//---------------adding routes to server-------------------
const route_user = require("./routes/users");
const route_profile = require("./routes/profiles");
const route_event = require("./routes/events");

app.use("/user", route_user);
app.use("/profile", route_profile);
app.use("/event", route_event);

//--------------establishing connection with database---------------
mongoose.connect(
  keys.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  err => {
    if (err) {
      console.log(err);
    } else {
      console.log("database connected");
    }
  }
);

//initializing passport
app.use(passport.initialize());
require("./config/passport")(passport);

app.get("/", (req, res) => {
  res.send("<h1>back-end api msi-event-management</h1>");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
