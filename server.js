const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* =========================
   1. API ROUTES (먼저)
========================= */
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/countries", require("./routes/countryRoutes"));
app.use("/api/regions", require("./routes/regionRoutes"));

/* =========================
   2. STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   3. ROOT PAGE
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

/* =========================
   4. FALLBACK (맨 마지막)
========================= */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});
