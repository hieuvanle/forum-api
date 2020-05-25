const User = require("../models/userModel");

module.exports = {
  register: async (req, res, next) => {
    const { name, email, password } = req.value.body;
    //Check if exists
    const nameExist = await User.findOne({ name });
    const emailExist = await User.findOne({ email });
    if (nameExist || emailExist)
      return res.status(400).json("User already exists. Please try again");
    try {
      const user = new User(req.value.body);
      await user.save();
      res.status(200).json(user.generateToken());
    } catch (err) {
      res.status(400).json(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.value.body;
      const user = await User.findByCredentials(email, password);
      const token = user.generateToken();
      res.status(200).json(token);
    } catch (err) {
      res.status(400).json(err);
    }
  },
};
