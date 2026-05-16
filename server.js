const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const masterRoutes = require("./routes/masterRoutes");
const fcmRoutes = require("./routes/fcmRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/fcm", fcmRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SERVER RUNNING:", PORT);
});
