const express = require("express");
const Song = require("../models/songModel");
const router = express.Router();

// Get all songs with optional search
router.get("/", async(req, res) => {
    try {
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
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update song
router.patch("/:id", async(req, res) => {
    try {
        const song = await Song.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );

        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }

        res.json(song);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete song
router.delete("/:id", async(req, res) => {
    try {
        const song = await Song.findByIdAndDelete(req.params.id);

        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }

        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;