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
      .select(
        `
        id,
        title,
        body,
        level,
        created_at,
        country_code,
        region_code,
        countries (
          name
        ),
        regions (
          name
        )
      `,
      )
      .order("created_at", { ascending: false });

    // =====================
    // FILTER
    // =====================
    if (year && month) {
      query = query
        .gte("created_at", `${year}-${month}-01`)
        .lte("created_at", `${year}-${month}-31`);
    } else if (year) {
      query = query
        .gte("created_at", `${year}-01-01`)
        .lte("created_at", `${year}-12-31`);
    } else if (month) {
      query = query.ilike("created_at", `%-${month}-%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    // =====================
    // FORMAT DATA
    // =====================
    const result = data.map((item) => ({
      ...item,
      level_text: `${item.level} Level`,
      country_name: item.countries?.name || "",
      region_name: item.regions?.name || "",
    }));

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
