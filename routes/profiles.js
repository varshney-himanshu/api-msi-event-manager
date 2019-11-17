const router = require("express").Router();
const mongoose = require("mongoose");
const Profile = require("../models/Profile");
const passport = require("passport");
const User = require("../models/User");
const { Parser } = require("json2csv");

const validateProfileRegisterInput = require("../utils/validation/profile-registration");

// @route   POST profile/register
// @desc    register profile
// @access  private

router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = validateProfileRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const {
      user,
      email,
      fullName,
      enrollment_id,
      course,
      institute,
      phone
    } = req.body;

    Profile.findOne({ user }).then(profile => {
      if (profile) {
        res.status(409).json({ error: "profile already exist" });
      } else {
        const newProfile = new Profile({
          user,
          email,
          fullName,
          enrollment_id,
          course,
          institute,
          phone
        });

        newProfile.save().then(profile => {
          const updata = {
            isProfileCreated: true
          };
          User.findOneAndUpdate({ _id: req.user.id }, updata, {
            new: true
          }).then(user => {
            res.status(200).json({ profile, user });
          });
        });
      }
    });
  }
);

// @route   POST profile/edit
// @desc    Update profile
// @access  private

router.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = validateProfileRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const {
      user,
      email,
      fullName,
      enrollment_id,
      phone,
      course,
      institute
    } = req.body;

    Profile.findOneAndUpdate(
      { user: req.user.id },
      { user, email, fullName, enrollment_id, phone, course, institute },
      { new: true }
    )
      .then(profile => {
        if (profile) {
          res.status(200).json(profile);
        }
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET /profile/
// @desc    get profile
// @access  private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { _id } = req.user;

    Profile.findOne({ user: _id })
      .then(profile => {
        if (profile) {
          res.status(200).json(profile);
        } else {
          status(404).json({ error: "Profile Not Found!" });
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.params;

    Profile.findOne({ user: id })
      .then(profile => {
        if (profile) {
          res.status(200).json(profile);
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route   PUT /profile/add-phone
// @desc    update phone in profile
// @access  private

router.put(
  "/add-phone",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { phone } = req.body;

    Profile.findOneAndUpdate({ user: req.user.id }, { phone }, { new: true })
      .then(profile => {
        if (profile) {
          res.status(200).json(profile);
        }
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);

// @route   PUT /profile/add-registered-event
// @desc    add events that user registers
// @access  private

router.put(
  "/add-registered-event/id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { eventId } = req.body;
    const { id } = req.user;
    Profile.findOneAndUpdate(
      { user: id },
      { $push: { registered: eventId } },
      { new: true }
    )
      .then(profile => {
        if (profile) {
          res.status(200).json(profile);
        }
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);

router.put(
  "/add-registered-event/email",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { eventId, email } = req.body;
    // const { email } = req.user;
    Profile.findOneAndUpdate(
      { email },
      { $push: { registered: eventId } },
      { new: true }
    )
      .then(profile => {
        if (profile) {
          res.status(200).json(profile);
        }
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);

// @route   PUT /profile/social
// @desc    update social media links in profile
// @access  private

router.put(
  "/social",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.user;
    const { social } = req.body;
    Profile.findOneAndUpdate({ user: id }, { social }, { new: true })
      .then(profile => {
        if (profile) {
          res.status(200).json(profile);
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route   GET /profile/all
// @desc    get all profiles
// @access  private (ADMIN only)

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(401).json({ msg: "unauthorized!" });
    }

    Profile.find()
      .then(profiles => {
        res.status(200).json(profiles);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);

// @route   POST /profile/ids
// @desc    get all profile with array of ids
// @access  private

router.post(
  "/ids",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.user;
    const { registered } = req.body;
    const ObjectId = mongoose.Types.ObjectId;

    const objIds = registered.map(id => (id = new ObjectId(id)));

    Profile.find({
      user: {
        $in: objIds
      }
    })
      .then(profiles => {
        if (profiles) {
          res.status(200).send(profiles);
        }
      })
      .catch(err => {
        res.status(400);
      });
  }
);

router.post(
  "/ids/download",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { registered } = req.body;
    const ObjectId = mongoose.Types.ObjectId;
    const objIds = registered.map(id => (id = new ObjectId(id)));

    //   console.log(objIds);
    Profile.find({
      user: {
        $in: objIds
      }
    })
      .then(profiles => {
        if (profiles) {
          const fields = [
            "fullName",
            "email",
            "phone",
            "enrollment_id",
            "institute",
            "course"
          ];

          const fieldNames = [
            "Name",
            "Email",
            "Phone",
            "Enrollment No.",
            "Institute",
            "Course"
          ];

          const opts = {
            fields,
            excelStrings: false
          };

          const parser = new Parser(opts);
          const csv = parser.parse(profiles);
          console.log(csv);

          res.attachment("registered.csv");

          res.status(200).send(csv);
        }
      })
      .catch(err => {
        res.status(400);
      });
  }
);

// @route   DELETE /profile
// @desc    delete user profile
// @access  private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.user;

    Profile.findOneAndDelete({ user: id })
      .then(profile => {
        if (profile) {
          res.status(200).json(profile);
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route   POST profile/emails
// @desc    get all users with array of emails
// @access  private

router.post(
  "/emails",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { emails } = req.body;
    Profile.find({
      email: {
        $in: emails
      }
    }).then(profiles => {
      if (profiles) {
        res.status(200).send(profiles);
      }
    });
  }
);

module.exports = router;
