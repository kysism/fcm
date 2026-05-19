const supabase = require("../services/supabaseService");

// ===============================
// GET COUNTRIES
// ===============================
exports.getCountries = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("countries")
      .select("*")
      .order("name", { ascending: true });

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
// CREATE COUNTRY
// ===============================
exports.createCountry = async (req, res) => {
  try {
    const { code, name } = req.body;

    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: "code and name are required",
      });
    }

    const { data, error } = await supabase
      .from("countries")
      .insert([
        {
          code: code.toUpperCase(),
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
// UPDATE COUNTRY
// ===============================
exports.updateCountry = async (req, res) => {
  try {
    const { code } = req.params;
    const { name } = req.body;

    const { data, error } = await supabase
      .from("countries")
      .update({
        name,
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
// DELETE COUNTRY
// ===============================
exports.deleteCountry = async (req, res) => {
  try {
    const { code } = req.params;

    const { error } = await supabase
      .from("countries")
      .delete()
      .eq("code", code);

    if (error) throw error;

    return res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
