const supabase = require("../services/supabaseService");

exports.getRegions = async (req, res) => {
  try {
    const countryCode = req.query.country_code;

    if (!countryCode) {
      return res.status(400).json({
        success: false,
        message: "country_code is required",
      });
    }

    const { data, error } = await supabase
      .from("regions")
      .select("*")
      .eq("country_code", countryCode)
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
