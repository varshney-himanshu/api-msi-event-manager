const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const keys = require("./config/keys"); //importing keys for database connection

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

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>back-end api msi-event-management</h1>");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
