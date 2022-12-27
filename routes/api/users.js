const express = require("express");
const router = express.Router();
// https://express-validator.github.io/docs/custom-error-messages.html#field-level
const { check, validationResult } = require("express-validator");

// @route   POST api/users
// @desc    Register route
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({
      min: 6,
    }),
  ],
  (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("User route");
    console.log("user posting");
  }
);

// router.get("/", (req, res) => res.send("user api"));
module.exports = router;
