const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("user/");
});

module.exports = router;
