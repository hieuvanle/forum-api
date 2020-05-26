const User = require("../models/userModel");
const Post = require("../models/postModel");
const fs = require("fs");
const sharp = require("sharp");
const { uploads, destroy } = require("../cloudinary");

module.exports = {
  //All users
  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.json(err);
    }
  },
  //Specific user
  getOne: async (req, res, next) => {
    try {
      const foundUser = await User.findById(req.value.params.id)
        .populate("posts")
        .select("-password");
      res.status(200).json(foundUser);
    } catch (err) {
      res.json(err);
    }
  },
  updateAvatar: async (req, res, next) => {
    try {
      //Resize image
      const file = req.files[0];
      await sharp(file.path)
        .resize(100, 100)
        .toFile("assets\\resized-" + file.originalname);

      const user = await User.findById(req.params.id);
      if (user.image !== "None") await destroy(user.imageId);
      user.image = "assets\\resized-" + file.originalname;
      const result = await uploads(user.image);
      user.image = result.url;
      user.imageId = result.id;
      await user.save();
      fs.unlinkSync("assets\\" + file.originalname);
      res.status(200).json("Successfully updated!");
    } catch (err) {
      res.json(err);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      await User.findByIdAndUpdate(req.value.params.id, req.value.body);
      res.status(200).json("Successfully updated!");
    } catch (err) {
      res.json(err);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.value.params.id);
      res.status(200).json("Successfully deleted!");
    } catch (err) {
      res.json(err);
    }
  },
  //Specific user, all posts
  getPosts: async (req, res, next) => {
    try {
      const foundUser = await User.findById(req.value.params.id).populate(
        "posts"
      );
      res.status(200).json(foundUser.posts);
    } catch (err) {
      res.json(err);
    }
  },
  addPost: async (req, res, next) => {
    try {
      const foundUser = await User.findById(req.value.params.id);
      //Create post
      const newPost = new Post(req.value.body);
      newPost.author = req.value.params.id;
      await newPost.save();
      //Update user
      foundUser.posts.push(newPost);
      await foundUser.save();
      res.status(200).json("Successfully added!");
    } catch (err) {
      res.json(err);
    }
  },
  //Specific user, specific post
  getOnePost: async (req, res, next) => {
    try {
      const foundPost = await Post.findById(req.value.params.postId);
      res.status(200).json(foundPost);
    } catch (err) {
      res.json(err);
    }
  },
  updatePost: async (req, res, next) => {
    try {
      const updatedPost = await Post.findById(req.value.params.postId);
      const author = await User.findById(req.value.body.author);
      if (updatedPost.author.equals(author._id)) {
        await Post.findByIdAndUpdate(updatedPost._id, req.body);
        res.status(200).json("Successfully updated!");
      } else {
        res.status(400).json("This post does not belong to " + author.name);
      }
    } catch (err) {
      res.json(err);
    }
  },
  deletePost: async (req, res, next) => {
    try {
      const deletedPost = await Post.findById(req.value.params.postId);
      const author = await User.findById(deletedPost.author);
      console.log(deletedPost);
      console.log(author);
      if (deletedPost.author.equals(author._id)) {
        await deletedPost.remove();
        author.posts.pull(deletedPost);
        await author.save();
        res.status(200).json("Successfully deleted!");
      } else {
        res.status(400).json("This post does not belong to" + author.name);
      }
    } catch (err) {
      res.json(err);
    }
  },
};
