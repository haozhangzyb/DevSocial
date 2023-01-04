import express from "express";

import connectDB from "./config/db.js";
import usersRoute from "./routes/api/users.js";
import authRoute from "./routes/api/auth.js";
import profileRoute from "./routes/api/profile.js";
import postsRoute from "./routes/api/posts.js";

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

// Define Routes
// app.use("/api/users", require("./routes/api/users"));
// app.use("/api/auth", require("./routes/api/auth"));
// app.use("/api/posts", require("./routes/api/posts"));
// app.use("/api/profile", require("./routes/api/profile"));

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/profile", profileRoute);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Sever started on port ${PORT}`));
