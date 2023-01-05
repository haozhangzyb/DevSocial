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

// @route   PUT api/posts/like/:post_id
// @desc    Like a post
// @access  Private
router.put("/like/:post_id", auth, async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.post_id);

    if (
      foundPost.likes.some((like) => like.user.toString() === req.user.id)
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    foundPost.likes.unshift({ user: req.user.id });

    await foundPost.save();

    return res.json(foundPost.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("server error");
  }
});

// @route   PUT api/posts/unlike/:post_id
// @desc    Unlike a post
// @access  Private
router.put("/unlike/:post_id", auth, async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.post_id);

    if (!foundPost) {
      return res.status(400).json({ msg: "post not found" });
    }

    if (
      !foundPost.likes.some((like) => like.user.toString() === req.user.id)
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    foundPost.likes = foundPost.likes.filter(
      (like) => like.user.toString() != req.user.id
    );

    await foundPost.save();

    return res.json(foundPost.likes);
  } catch (err) {
    console.error(err);
    return res.status(500).json("server error");
  }
});

export default router;
