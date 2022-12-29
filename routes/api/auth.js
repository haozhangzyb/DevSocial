const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const User = require("../../models/User");

// @route   GET api/auth
// @desc    get user data by using JWT token(middleware auth is for decode)
// @access  Public
router.get("/", auth, async (req, res) => {
  try {
    // get user info but filter out password
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.msg);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
