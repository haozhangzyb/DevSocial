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

// module.exports = router;
export default router;
