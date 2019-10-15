const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>back-end api msi-event-management</h1>");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
