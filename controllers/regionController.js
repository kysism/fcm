const supabase = require("../services/supabaseService");

// =========================
// GET BY COUNTRY
// =========================
exports.getRegions = async (req, res) => {
  try {
    const { country_code } = req.query;

    const { data, error } = await supabase
      .from("regions")
      .select("*")
      .eq("country_code", country_code)
      .order("name");

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
// CREATE
// =========================
exports.createRegion = async (req, res) => {
  try {
    const { code, country_code, name } = req.body;

    if (!code || !country_code || !name) {
      return res.status(400).json({
        success: false,
        message: "code, country_code, name required",
      });
    }

    if (code.length !== 3) {
      return res.status(400).json({
        success: false,
        message: "code must be 3 characters",
      });
    }

    // ⭐ DUP CHECK (server side safety)
    const exists = await supabase
      .from("regions")
      .select("code")
      .eq("code", code)
      .maybeSingle();

    if (exists.data) {
      return res.json({
        success: false,
        message: "Code already exists",
      });
    }

    const { data, error } = await supabase
      .from("regions")
      .insert([{ code, country_code, name }])
      .select();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
// UPDATE
// =========================
exports.updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const { data, error } = await supabase
      .from("regions")
      .update({ name })
      .eq("code", id)
      .select();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
// DELETE
// =========================
exports.deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("regions").delete().eq("code", id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
// DUP CHECK API (NEW)
// =========================
exports.checkRegionCode = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "code required",
      });
    }

    const { data } = await supabase
      .from("regions")
      .select("code")
      .eq("code", code)
      .maybeSingle();

    res.json({
      exists: !!data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
