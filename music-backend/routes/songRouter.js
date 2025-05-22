const express = require("express");
const Song = require("../models/songModel");

const router = express.Router();

// Get all songs or search
router.get("/", async(req, res) => {
    const { search } = req.query;
    let query = {};
    if (search) {
        query = {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { artist: { $regex: search, $options: "i" } }
            ]
        };
    }
    const songs = await Song.find(query);
    res.json(songs);
});

// Add song
router.post("/", async(req, res) => {
    console.log('POST /api/song - req.body:', req.body);
    try {
        const song = new Song(req.body);
        await song.save();
        console.log('Đã lưu bài hát mới:', song);
        res.json(song);
    } catch (err) {
        console.error('Lỗi khi lưu bài hát:', err);
        res.status(400).json({ error: err.message });
    }
});

// Update song
router.put("/:id", async(req, res) => {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(song);
});

// Delete song
router.delete("/:id", async(req, res) => {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

module.exports = router;