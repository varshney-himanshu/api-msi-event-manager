const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      required: true
    },

    phone: {
      type: String
    },

    isProfileCreated: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("users", userSchema);
