import express from "express";
const router = express.Router();
import { check, validationResult } from "express-validator";

import auth from "../../middleware/auth.js";
import User from "../../models/User.js";
import Post from "../../models/Post.js";

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  [auth, check("text").notEmpty().withMessage("text is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        user: user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      });

      const postResult = await newPost.save();

      return res.json(postResult);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json("server error");
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: "desc" });
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("server error");
  }
});

// @route   Get api/posts/:id
// @desc    Get a post by id
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.id);

    if (!foundPost) return res.status(404).json("no post found");

    return res.json(foundPost);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("server error");
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.id);

    if (!foundPost) return res.status(404).json("no post found");

    // Check user
    if (foundPost.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await foundPost.delete();

    return res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("server error");
  }
});

export default router;
