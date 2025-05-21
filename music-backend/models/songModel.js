const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    cover: { type: String, required: true },
    src: { type: String, required: true },
    views: { type: Number, default: 0 },
    duration: { type: String, default: "0:00" }
});

module.exports = mongoose.model("Song", SongSchema);