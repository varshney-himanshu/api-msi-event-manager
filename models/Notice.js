const mongoose = require("mongoose");
const schema = mongoose.Schema;

const noticeSchema = new schema(
  {
    text: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = Notice = mongoose.model("notices", noticeSchema);
