const router = require("express").Router();
const Profile = require("../models/Profile");
const passport = require("passport");
const User = require("../models/User");

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

    const { user, enrollment_id, course, institute } = req.body;
    Profile.findOne({ user }).then(profile => {
      if (profile) {
        res.status(409).json({ error: "profile already exist" });
      } else {
        const newProfile = new Profile({
          user,
          enrollment_id,
          course,
          institute
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

// @route   PUT profile/
// @desc    update profile
// @access  private

router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = validateProfileRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { user, enrollment_id, course, institute } = req.body;

    Profile.findOneAndUpdate(
      { user: req.user.id },
      { user, enrollment_id, course, institute },
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
    const { id } = req.user;

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
  "/add-registered-event",
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
    if (req.user.role !== "ADMIN") {
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

module.exports = router;
