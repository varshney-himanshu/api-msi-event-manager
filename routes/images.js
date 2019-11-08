const router = require("express").Router();
const HomeImage = require("../models/HomeImage");
const multer = require("multer");
const passport = require("passport");

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
  folder: "msi-events/home"
});
const upload = multer({ storage: storage });

router.post(
  "/home/add",
  [passport.authenticate("jwt", { session: false }), upload.single("image")],
  (req, res) => {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(401).json({ msg: "unauthorized" });
    }

    var data = {};
    data.url = req.file.url;
    data.id = req.file.public_id;

    const event = JSON.parse(req.body.event);
    const newImage = new HomeImage({
      data,
      event
    });

    newImage
      .save()
      .then(image => {
        if (image) {
          res.status(200).json({ success: true });
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

router.get("/home", (req, res) => {
  HomeImage.find()
    .sort({ createdAt: -1 })
    .then(images => {
      if (images) {
        res.status(200).json(images);
      }
    })
    .catch(err => res.status(400).json(err));
});

router.delete(
  "/home/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(401).json({ msg: "unauthorized" });
    }

    const id = req.params.id;

    HomeImage.findOneAndDelete({ _id: id })
      .then(image => {
        if (image) {
          const result = cloudinary.v2.uploader.destroy(image.data.id);
          res.status(200).json({ success: result });
        }
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);

module.exports = router;
