const express = require("express");
const User = require("../models/userModel");

const router = express.Router();

// Đăng nhập
router.post("/login", async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });
    if (password !== user.password) return res.status(400).json({ error: "Wrong password" });
    res.json({ success: true, username: user.username });
});

module.exports = router;