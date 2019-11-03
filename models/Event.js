const mongoose = require("mongoose");
const schema = mongoose.Schema;

const eventSchema = new schema(
  {
    creator: {
      type: schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    image: {
      url: { type: String },
      public_id: { type: String }
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    venue: {
      type: String,
      required: true
    },
    usersRegistered: [{ type: schema.Types.ObjectId }]
  },
  { timestamps: true }
);

module.exports = Event = mongoose.model("events", eventSchema);
