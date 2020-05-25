const User = require("../models/userModel");
const Post = require("../models/postModel");
const shortenText = require("../middlewares/shortenText");

module.exports = {
  getAllPosts: async (req, res, next) => {
    try {
      const posts = await Post.find().populate("author");
      posts.forEach((post) => {
        post.content = shortenText(post.content);
      });
      res.status(200).json(posts);
    } catch (err) {
      res.json(err);
    }
  },
  addPost: async (req, res, next) => {
    try {
      const author = await User.findById(req.body.author);
      //Create new post
      const newPost = new Post(req.body);
      await newPost.save();
      //Update user
      author.posts.push(newPost);
      await author.save();
      res.status(200).json("Successfully added");
    } catch (err) {
      res.json(err);
    }
  },
  //Specific post
  getOne: async (req, res, next) => {
    try {
      const foundPost = await Post.findById(req.params.id).populate("author");
      res.status(200).json(foundPost);
    } catch (err) {
      res.json(err);
    }
  },
};
