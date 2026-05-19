const supabase = require("../services/supabaseService");

// =========================
// GET (BY COUNTRY)
// =========================
exports.getRegions = async (req, res) => {
  try {
    const { country_code } = req.query;

    if (!country_code) {
      return res.status(400).json({
        success: false,
        message: "country_code is required",
      });
    }

    const { data, error } = await supabase
      .from("regions")
      .select("*")
      .eq("country_code", country_code)
      .order("name", { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// CREATE
// =========================
exports.createRegion = async (req, res) => {
  try {
    const { country_code, name } = req.body;

    if (!country_code || !name) {
      return res.status(400).json({
        success: false,
        message: "country_code and name required",
      });
    }

    const { data, error } = await supabase
      .from("regions")
      .insert([{ country_code, name }])
      .select();

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
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

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
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

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
