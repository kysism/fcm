const supabase = require("../services/supabaseService");

// ===============================
// GET REGIONS
// ===============================
exports.getRegions = async (req, res) => {
  try {
    const countryCode = req.query.country_code;

    let query = supabase
      .from("regions")
      .select("*")
      .order("name", { ascending: true });

    if (countryCode && countryCode !== "all") {
      query = query.eq("country_code", countryCode);
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// CREATE
exports.createRegion = async (req, res) => {
  try {
    const { country_code, name } = req.body;

    const { data, error } = await supabase
      .from("regions")
      .insert([{ country_code, name }])
      .select();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
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

// DELETE
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
