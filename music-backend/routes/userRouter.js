const express = require("express");
const User = require("../models/userModel");
const Song = require("../models/songModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware checkLogin
function checkLogin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        req.userId = decoded.id;
        next();
    });
}

// Register
router.post("/register", async(req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash });
    await user.save();
    res.json({ success: true });
});

// Login
router.post("/login", async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Wrong password" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, userId: user._id });
});

// Get user info (cần đăng nhập)
router.get("/:id", checkLogin, async(req, res) => {
    if (req.userId !== req.params.id) return res.status(403).json({ error: "Forbidden" });
    const user = await User.findById(req.params.id).populate("favorites");
    res.json(user);
});

// Get user's favorites (cần đăng nhập)
router.get("/:id/favorites", checkLogin, async(req, res) => {
    if (req.userId !== req.params.id) return res.status(403).json({ error: "Forbidden" });
    const user = await User.findById(req.params.id).populate("favorites");
    res.json(user.favorites);
});

// Add to favorites (cần đăng nhập)
router.post("/:id/favorites", checkLogin, async(req, res) => {
    if (req.userId !== req.params.id) return res.status(403).json({ error: "Forbidden" });
    const { songId } = req.body;
    const user = await User.findById(req.params.id);
    if (!user.favorites.includes(songId)) {
        user.favorites.push(songId);
        await user.save();
    }
    res.json(user.favorites);
});

// Remove from favorites (cần đăng nhập)
router.delete("/:id/favorites/:songId", checkLogin, async(req, res) => {
    if (req.userId !== req.params.id) return res.status(403).json({ error: "Forbidden" });
    const user = await User.findById(req.params.id);
    user.favorites = user.favorites.filter(fav => fav.toString() !== req.params.songId);
    await user.save();
    res.json(user.favorites);
});

module.exports = router;