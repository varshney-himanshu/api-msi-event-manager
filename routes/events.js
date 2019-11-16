const router = require("express").Router();
const Event = require("../models/Event");
const passport = require("passport");
const mongoose = require("mongoose");
const multer = require("multer");
const { Parser } = require("json2csv");
const {
  cloud_api_key,
  cloud_name,
  cloud_api_secret
} = require("../config/keys");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: cloud_name,
  api_key: cloud_api_key,
  api_secret: cloud_api_secret
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "msi-events/events"
});
const upload = multer({ storage: storage });

const validateEventRegisterInput = require("../utils/validation/event-registration");

// @route   POST /event/register
// @desc    add new event
// @access  private

router.post(
  "/register",
  [passport.authenticate("jwt", { session: false }), upload.single("imgFile")],
  (req, res) => {
    if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
      return res.status(401).json({ msg: "unauthorized" });
    }

    const { isValid, errors } = validateEventRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    var image = {};

    image.url = req.file.url;
    image.public_id = req.file.public_id;
    console.log(image);

    const {
      creator,
      venue,
      description,
      title,
      deadline,
      date,
      type,
      members
    } = req.body;

    let event = {
      creator,
      venue,
      description,
      title,
      image,
      deadline,
      date,
      type
    };

    if (type === "MULTIPLE") {
      event.members = members;
    }

    const newEvent = new Event(event);

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
      .sort({ createdAt: -1 })
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

// @route   PUT /event/:id
// @desc    Update event by id
// @access  private

router.put(
  "/:id",
  [passport.authenticate("jwt", { session: false }), upload.single("imgFile")],
  (req, res) => {
    const { isValid, errors } = validateEventRegisterInput(req.body);

    if (!isValid) {
      return res.status(200).json(errors);
    }

    const { venue, description, title, deadline, date, image_prev } = req.body;

    let updatedata = {};
    updatedata.venue = venue;
    updatedata.description = description;
    updatedata.title = title;
    updatedata.deadline = deadline;
    updatedata.date = date;

    if (req.file) {
      var image = {};
      image.url = req.file.url;
      image.public_id = req.file.public_id;
      updatedata.image = image;
      const prevImage = JSON.parse(image_prev);

      cloudinary.v2.uploader.destroy(prevImage.public_id);
    }

    const { id } = req.params;

    Event.findOneAndUpdate({ _id: id, creator: req.user.id }, updatedata, {
      new: true
    })
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

router.post(
  "/:id/register-user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    console.log(id, user);
    Event.findOneAndUpdate(
      { _id: id },
      { $push: { usersRegistered: user } },
      { new: true }
    )
      .then(event => {
        console.log(event);
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
    Event.findOneAndDelete({ _id: id })
      .then(event => {
        if (event) {
          cloudinary.v2.uploader.destroy(event.image.public_id);
          res.status(200).json(event);
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route   POST /event/ids
// @desc    get all events with array of ids
// @access  private

router.post(
  "/ids",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { registered } = req.body;
    const ObjectId = mongoose.Types.ObjectId;
    const objIds = registered.map(id => (id = new ObjectId(id)));

    Event.find({
      _id: {
        $in: objIds
      }
    })
      .then(events => {
        if (events) {
          res.status(200).send(events);
        }
      })
      .catch(err => {
        res.status(400);
      });
  }
);

router.post(
  "/download-teams-registered",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { registerData, members, type } = req.body;
    let fields = [];

    if (type === "MULTIPLE") {
      fields.push("teamName");
      for (let i = 1; i <= Number(members); i++) {
        fields.push(`Member_${i}_Name`);
        fields.push(`Member_${i}_Email`);
        fields.push(`Member_${i}_E_ID`);
        fields.push(`Member_${i}_Phone`);
        fields.push(`Member_${i}_Institute`);
        fields.push(`Member_${i}_Course`);
      }
    } else {
      fields = [
        "fullName",
        "email",
        "phone",
        "enrollment_id",
        "institute",
        "course"
      ];
    }

    const opts = {
      fields,
      excelStrings: false
    };

    const parser = new Parser(opts);
    const csv = parser.parse(registerData);
    console.log(csv);

    res.attachment("registered.csv");

    res.status(200).send(csv);
  }
);

module.exports = router;
