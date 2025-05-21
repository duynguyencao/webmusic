const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./db/dbConnect");
const songRouter = require("./routes/songRouter");
const userRouter = require("./routes/userRouter");

const app = express();
dbConnect();

app.use(cors());
app.use(express.json());

app.use("/api/song", songRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
    res.send({ message: "Hello from webmusic API!" });
});

app.listen(5000, () => {
    console.log("server listening on port 5000");
});