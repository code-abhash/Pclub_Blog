// server/models/userModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@iiti\.ac\.in$/,
      "Please use a valid @iiti.ac.in email address",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});


userSchema.pre("save", async function (next) {
  // Hash password only if it has been modified
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Method for comparing passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
