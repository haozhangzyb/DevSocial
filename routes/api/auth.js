const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const config = require("config");

const User = require("../../models/User");
const auth = require("../../middleware/auth");

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

// @route   POST api/auth
// @desc    Authenticate user(Login) and get token
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // see if user exists
      let user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid email" }] });
      }

      // compare the password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid password" }] });
      }

      // get the payload from db with the user id(_id)
      const payload = {
        user: { id: user.id },
      };

      jwt.sign(
        payload,
        config.get("jwtSecretToken"),
        { expiresIn: 360000 },
        (err, encoded) => {
          if (err) throw err;
          res.json({ token: encoded });
        }
      );
      // res.send("User registered");
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
    // console.log(req.body);
    // console.log("user posting");
  }
);

module.exports = router;
