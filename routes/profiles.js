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

module.exports = router;
