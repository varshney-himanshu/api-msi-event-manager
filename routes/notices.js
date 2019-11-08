const router = require("express").Router();
const passport = require("passport");
const Notice = require("../models/Notice");

router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(401).json({ msg: "unauthorized" });
    }
    const { text } = req.body;

    const newNotice = new Notice({ text });
    newNotice
      .save()
      .then(notice => {
        if (notice) {
          res.status(200).json(notice);
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

router.post(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(401).json({ msg: "unauthorized" });
    }
    const { text } = req.body;
    const _id = req.params.id;

    Notice.findOneAndUpdate({ _id }, { text }, { new: true })
      .then(notice => {
        if (notice) {
          res.status(200).json(notice);
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

router.get("/latest", (req, res) => {
  Notice.find()
    .limit(1)
    .sort({ $natural: -1 })
    .then(notices => {
      if (notices) {
        res.status(200).json(notices[0]);
      }
    })
    .catch(err => res.status(400).json(err));
});

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(401).json({ msg: "unauthorized" });
    }
    Notice.find()
      .sort({ $natural: -1 })
      .then(notices => {
        if (notices) {
          res.status(200).json(notices);
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(401).json({ msg: "unauthorized" });
    }
    const id = req.params.id;

    Notice.findOneAndDelete({ _id: id })
      .then(notice => {
        if (notice) {
          res.status(200).json(notice);
        }
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);

module.exports = router;
