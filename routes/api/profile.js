import express from "express";
const router = express.Router();
import { check, validationResult } from "express-validator";
import normalizeURL from "normalize-url";
import config from "config";
import axios from "axios";

import auth from "../../middleware/auth.js";
import Profile from "../../models/Profile.js";
import User from "../../models/User.js";

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
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

// @route   POST api/profile/
// @desc    Create or update current user's profile
// @access  Private
router.post(
  "/",
  [
    auth,
    check("status", "Status is required").notEmpty(),
    check("skills", "At least one skill is required").not().isEmpty(),
    check("website", "Invalid URL").optional().isURL(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // deconstruct the request object
    const {
      skills,
      website,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
      ...rest
    } = req.body;

    const profileFields = {
      user: req.user.id,
      website: normalizeURL(website, { forceHttps: true }),
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill) => skill.trim()),
      // date: Date.now(),
      ...rest,
    };

    // build the socialFields Object and sanitize them
    const socialFields = {
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    };

    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length) {
        socialFields[key] = normalizeURL(value, { forceHttps: true });
      }
    }
    profileFields.social = socialFields;

    try {
      // Using upsert option (creates new doc if no match is found),
      // set the new option to true to return the document after update was applied.
      // set fields to default value if not provided
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.send(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("server error");
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", [
      "name",
      "avatar",
    ]);
    return res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile)
      return res.status(400).json({ msg: "No profile for this user" });

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    // when user_id param is not a valid ObjectID, we still want to return back this message
    if (err.kind == "ObjectId") {
      return res
        .status(400)
        .json({ msg: "No profile for this user(invalid user_id)" });
    }
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user and posts
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    await Promise.all([
      // @TODO: remove user posts

      // Remove profile
      await Profile.findOneAndDelete({ user: req.user.id }),
      // Remove user
      await User.findByIdAndDelete(req.user.id),
    ]);

    return res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title").notEmpty().withMessage("Title is required"),
      check("company").notEmpty().withMessage("Company is required"),
      check("from")
        .notEmpty()
        .custom((value, { req }) =>
          req.body.to ? value < req.body.to : true
        )
        .withMessage(
          "Start Date is required and needs to be from the past"
        ),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(req.body);
      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json("Server Error");
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    foundProfile.experience = foundProfile.experience.filter(
      (exp) => exp._id.toString() != req.params.exp_id
    );
    await foundProfile.save();

    return res.status(200).json(foundProfile);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json("server error");
  }
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
  "/education",
  [
    auth,
    [
      check("school").notEmpty().withMessage("School is required"),
      check("degree").notEmpty().withMessage("degree is required"),
      check("fieldofstudy")
        .notEmpty()
        .withMessage("Field of study is required"),
      check("from")
        .notEmpty()
        .custom((value, { req }) =>
          req.body.to ? value < req.body.to : true
        )
        .withMessage(
          "Start Date is required and needs to be from the past"
        ),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(req.body);
      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json("Server Error");
    }
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    foundProfile.education = foundProfile.education.filter(
      (edu) => edu._id.toString() != req.params.edu_id
    );
    await foundProfile.save();

    return res.status(200).json(foundProfile);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json("server error");
  }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get("/github/:username", async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      "user-agent": "node.js",
      Authorization: `token ${config.get("githubClientSecret")}`,
    };

    // const gitHubResponse = await axios.get(uri, { headers });
    const gitHubResponse = await axios.get(uri);
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: "No Github profile found" });
  }
});

export default router;
