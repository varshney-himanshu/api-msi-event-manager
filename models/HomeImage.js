const mongoose = require("mongoose");
const schema = mongoose.Schema;

const HomeImageSchema = new schema(
  {
    event: {
      type: String,
      default: ""
    },
    image: {
      data: Buffer,
      contentType: String
    },
    msg: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = HomeImage = mongoose.model("homeimages", HomeImageSchema);
