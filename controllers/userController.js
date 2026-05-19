const supabase = require("../services/supabaseService");

// ===============================
// USER REGISTER
// ===============================
exports.register = async (req, res) => {
  try {
    const { name, phone, country_code, region_code, fcm_token } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "name and phone are required",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          name,
          phone,
          country_code,
          region_code,
          fcm_token,
          role: "user",
          is_active: true,
        },
        { onConflict: "phone" },
      )
      .select();

    if (error) throw error;

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// FCM TOKEN UPDATE
// ===============================
exports.registerToken = async (req, res) => {
  try {
    const { phone, token } = req.body;

    if (!phone || !token) {
      return res.status(400).json({
        success: false,
        message: "phone and token are required",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        fcm_token: token,
        last_token_update: new Date(),
      })
      .eq("phone", phone)
      .select();

    if (error) throw error;

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("TOKEN UPDATE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getUserByToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "token is required",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("fcm_token", token)
      .maybeSingle();

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

exports.getUsers = async (req, res) => {
  try {
    const { country_code, region_code } = req.query;

    let query = supabase
      .from("users")
      .select("*")
      .neq("role", "admin")
      .order("name", { ascending: true });

    if (country_code && country_code !== "all") {
      query = query.eq("country_code", country_code);
    }

    if (region_code && region_code !== "all") {
      query = query.eq("region_code", region_code);
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
