require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Define userSchema
const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    posts: [{ type: Schema.Types.ObjectID, ref: "Post" }],
    image: {
      type: String,
      default: "Null",
    },
    imageId: {
      type: String,
      default: "Null",
    },
  },
  {
    timestamps: true,
  }
);

//Generate token
userSchema.methods = {
  generateToken() {
    const user = this;
    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: 3600 }
    );
    return token;
  },
};

//Check user
userSchema.statics = {
  async findByCredentials(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Incorrect email or password. Please try again");
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Incorrect email or password. Please try again");
    }
    return user;
  },
};

//Hash password
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 8);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
