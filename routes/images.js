const router = require("express").Router();
const HomeImage = require("../models/HomeImage");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/home/add", upload.single("image"), (req, res) => {
  var image = {};

  image.data = req.file.buffer;
  image.contentType = "image/jpeg";

  const event = req.body.event || "";

  const newImage = new HomeImage({
    image,
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
});

router.get("/home", (req, res) => {
  HomeImage.find()
    .then(images => {
      if (images) {
        res.status(200).json(images);
      }
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;
