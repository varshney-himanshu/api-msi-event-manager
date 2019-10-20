const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ProfileSchema = new schema(
  {
    user: {
      type: schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    enrollment_id: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    course: {
      type: String,
      required: true
    },
    institute: {
      type: String,
      required: true
    },
    social: {
      facebook: { type: String },
      twitter: { type: String },
      github: { type: String }
    },
    registered: [{ type: schema.Types.ObjectId }]
  },
  { timestamps: true }
);

module.exports = Profile = mongoose.model("profiles", ProfileSchema);
