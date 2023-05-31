const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const { authentication } = require("./middlewares/authentication");
const app = express();
const port = process.env.PORT || 8190;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Home page");
});
app.use("/api/auth", authRouter);
app.use("/api", authentication, userRouter);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`connected to MongoDB.`);
    app.listen(port, () => {
      console.log(`server listening on port ${port}`);
    });
  } catch (error) {
    console.log(`error in connection -> ${error}`);
  }
};
startServer();
