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

// ===============================
// CREATE REGION
// ===============================
exports.createRegion = async (req, res) => {
  try {
    const { code, country_code, name } = req.body;

    if (!code || !country_code || !name) {
      return res.status(400).json({
        success: false,
        message: "code, country_code, name are required",
      });
    }

    const { data, error } = await supabase
      .from("regions")
      .insert([
        {
          code: code.toUpperCase(),
          country_code,
          name,
        },
      ])
      .select();

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

// ===============================
// UPDATE REGION
// ===============================
exports.updateRegion = async (req, res) => {
  try {
    const code = req.params.code;

    const { name, country_code } = req.body;

    const { data, error } = await supabase
      .from("regions")
      .update({
        name,
        country_code,
      })
      .eq("code", code)
      .select();

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

// ===============================
// DELETE REGION
// ===============================
exports.deleteRegion = async (req, res) => {
  try {
    const code = req.params.code;

    const { error } = await supabase.from("regions").delete().eq("code", code);

    if (error) throw error;

    return res.json({
      success: true,
      message: "Deleted",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
