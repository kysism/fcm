const supabase = require("../services/supabaseService");

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
        },
      ])
      .select()
      .single();

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
