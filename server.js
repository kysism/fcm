const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* API */
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/countries", require("./routes/countryRoutes"));
app.use("/api/regions", require("./routes/regionRoutes"));

/* STATIC FILES */
app.use(express.static(path.join(__dirname, "public")));

/* ROOT → index.html */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/index.html"));
});

/* FALLBACK (API 보호 + SPA 지원) */
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API Not Found" });
  }

  res.sendFile(path.join(__dirname, "public/html/index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("SERVER RUNNING ON", PORT);
});
