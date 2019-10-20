const router = require("express").Router();
const Profile = require("../models/Profile");

router.get("/", (req, res) => {
  res.send("profile");
});

module.exports = router;
