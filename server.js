const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* API */
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/countries", require("./routes/countryRoutes"));
app.use("/api/regions", require("./routes/regionRoutes"));

/* STATIC */
app.use(express.static(path.join(__dirname, "public")));

/* ROOT */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/index.html"));
});

/* SAFE FALLBACK */
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API Not Found" });
  }

  res.sendFile(path.join(__dirname, "public/html/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SERVER RUNNING:", PORT);
});
