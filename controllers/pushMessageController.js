const supabase = require("../services/supabaseService");

// ======================
// CREATE
// ======================
exports.createMessage = async (req, res) => {
  try {
    const { title, body, level, country_code, region_code, created_by } =
      req.body;

    const { data, error } = await supabase
      .from("push_messages")
      .insert([
        {
          title,
          body,
          level,
          country_code,
          region_code,
          created_by,
          created_at: new Date(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================
// LIST (YEAR / MONTH FILTER)
// ======================
exports.getMessages = async (req, res) => {
  try {
    const { year, month } = req.query;

    let query = supabase
      .from("push_messages")
      .select("*")
      .order("created_at", { ascending: false });

    // year filter
    if (year) {
      query = query
        .gte("created_at", `${year}-01-01`)
        .lte("created_at", `${year}-12-31`);
    }

    // month filter (YYYY-MM)
    if (year && month) {
      const start = `${year}-${month}-01`;
      const end = `${year}-${month}-31`;

      query = supabase
        .from("push_messages")
        .select("*")
        .gte("created_at", start)
        .lte("created_at", end)
        .order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
