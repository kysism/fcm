const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* =========================
   API ROUTES
========================= */
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/countries", require("./routes/countryRoutes"));
app.use("/api/regions", require("./routes/regionRoutes"));

/* =========================
   STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   ROOT
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

/* =========================
   SAFE FALLBACK (핵심 수정)
========================= */
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({
      success: false,
      message: "API Not Found",
    });
  }

  res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});
