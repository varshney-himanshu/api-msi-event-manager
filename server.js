const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const keys = require("./config/keys"); //importing keys for database connection

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//--------------establishing connection with database---------------
mongoose.connect(
  keys.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) {
      console.log(err);
    } else {
      console.log("database connected");
    }
  }
);

//---------------adding routes to server-------------------
const route_user = require("./routes/users");

app.use("/user", route_user);

app.get("/", (req, res) => {
  res.send("<h1>back-end api msi-event-management</h1>");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
