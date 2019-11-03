const mongoose = require("mongoose");
const schema = mongoose.Schema;

const HomeImageSchema = new schema(
  {
    event: {
      id: { type: String },
      msg: { type: String }
    },
    data: {
      url: { type: String, require: true },
      id: { type: String, require: true }
    }
  },
  { timestamps: true }
);

module.exports = HomeImage = mongoose.model("homeimages", HomeImageSchema);
