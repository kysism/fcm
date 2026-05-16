const supabase = require("../services/supabaseService");

const allowedTables = {
  countries: "countries",
  departments: "departments",
  jobs: "jobs",
  offices: "offices",
  projects: "projects",
  regions: "regions",
};

exports.getMasterData = async (req, res) => {
  try {
    const tableKey = req.params.table;

    const table = allowedTables[tableKey];

    if (!table) {
      return res.status(400).json({
        success: false,
        message: "Invalid master table",
      });
    }

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
