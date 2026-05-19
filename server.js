const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* API FIRST */
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/countries", require("./routes/countryRoutes"));
app.use("/api/regions", require("./routes/regionRoutes"));
app.use("/api/fcm", require("./routes/fcmRoutes"));

/* ROOT EXPLICIT */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/index.html"));
});

/* STATIC BUT NO INDEX OVERRIDE */
app.use(
  express.static(path.join(__dirname, "public"), {
    index: false,
  }),
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("RUNNING ON", PORT);
});
