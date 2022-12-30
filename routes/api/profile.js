const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    //get user's profile by user id, and fill it in with user's name and avatar form UserSchema
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }

    return res.json(profile);
  } catch (err) {
    console.log(err.msg);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
