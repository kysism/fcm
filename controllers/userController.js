const supabase = require("../services/supabaseService");

// ===============================
// USER REGISTER
// ===============================
exports.register = async (req, res) => {
  try {
    const { name, phone, country_code, region_code, job_code, fcm_token } =
      req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "name and phone are required",
      });
    }

    const now = new Date();

    // 중복 체크 (핵심)
    const existing = await supabase
      .from("users")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

    if (existing.data) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          phone,
          country_code,
          region_code,
          job_code,
          fcm_token,

          // =========================
          // SYSTEM DEFAULTS
          // =========================
          role: "user",
          is_active: true,
        },
      ])
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

    const now = new Date();

    const { data, error } = await supabase
      .from("users")
      .update({
        fcm_token: token,
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
