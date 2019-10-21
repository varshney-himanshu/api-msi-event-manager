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

// @route   GET /event/all
// @desc    get all events
// @access  public

router.get("/all", (req, res) => {
  Event.find()
    .sort({ createdAt: -1 })
    .then(events => {
      res.status(200).json(events);
    });
});

router.get(
  "/user/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.user;

    Event.find({ creator: id })
      .then(events => {
        if (events) {
          res.status(200).json(events);
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route   GET /event/:id
// @desc    get event by id
// @access  public

router.get("/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  Event.findOne({ _id: id })
    .then(event => {
      if (event) {
        res.status(200).json(event);
      }
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = validateEventRegisterInput(req.body);

    if (!isValid) {
      return res.status(200).json(errors);
    }

    const { id } = req.params;
    const { creator, venue, description, title, deadline } = req.body;

    Event.findOneAndUpdate(
      { _id: id, creator: req.user.id },
      { creator, venue, description, title, deadline },
      { new: true }
    )
      .then(event => {
        if (event) {
          res.status(200).json(event);
        }
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);

router.put(
  "/:id/add-user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    Event.findOneAndUpdate(
      { creator: req.user.id, _id: id },
      { $push: { usersRegistered: user } },
      { new: true }
    )
      .then(event => {
        if (event) {
          res.status(200).json(event);
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.params;
    const user = req.user.id;
    Event.findOneAndDelete({ _id: id, creator: user })
      .then(event => {
        if (event) {
          res.status(200).json(event);
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

module.exports = router;