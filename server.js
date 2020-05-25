require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const authRouter = require("./routes/authRouter");
const path = require("path");

const PORT = process.env.PORT || 5000;

//Plugins
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("assets"));

//Routes
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/users", userRouter);

//Connect database
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.connection.once("open", () => {
  console.log("Connected to DB");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("forum-client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "forum-client", "build", "index.html"));
  });
}

app.listen(PORT, (res) => {
  console.log("Server is running...");
});
