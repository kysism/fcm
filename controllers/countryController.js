const supabase = require("../services/supabaseService");

exports.getCountries = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("countries")
      .select("*")
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
