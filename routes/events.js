const router = require("express").Router();
const Event = require("../models/Event");
const passport = require("passport");

const validateEventRegisterInput = require("../utils/validation/event-registration");

// @route   POST /event/register
// @desc    add new event
// @access  private

router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "ADMIN") {
      return res.status(401).json({ msg: "unauthorized" });
    }

    const { isValid, errors } = validateEventRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { creator, venue, description, title, deadline } = req.body;

    const newEvent = new Event({
      creator,
      venue,
      description,
      title,
      deadline
    });

    newEvent
      .save()
      .then(event => {
        if (event) {
          res.status(200).json(event);
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

module.exports = router;
