const express = require("express");
const router = express.Router();
// https://express-validator.github.io/docs/custom-error-messages.html#field-level
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../../models/User");

// @route   POST api/users
// @desc    Register route
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // see if user exists
      let user = await User.findOne({ email: email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // set user gravatar
      const avatar = gravatar.url(email, {
        size: "200",
        rating: "pg",
        default: "mm",
      });

      // create user
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // save the user to the db
      await user.save();

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

// router.get("/", (req, res) => res.send("user api"));
module.exports = router;
