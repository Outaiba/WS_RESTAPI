const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, default: null },
  password: { type: String, default: null },
  token: { type: String },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
