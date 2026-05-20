// ===============================
// USER REGISTER
// ===============================
const supabase = require("../services/supabaseService");

// ===============================
// USER REGISTER (UPDATED)
// ===============================
exports.register = async (req, res) => {
  try {
    const { name, phone, country_code, region_code, role, token, device_os } =
      req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "name and phone are required",
      });
    }

    // 1. USERS UPSERT (role 기본값 처리)
    const { data: user, error: userError } = await supabase
      .from("users")
      .upsert(
        {
          name,
          phone,
          country_code,
          region_code,
          role: role || "user", // ⭐ 핵심 변경
          is_active: true,
          updated_at: new Date(),
        },
        { onConflict: "phone" },
      )
      .select()
      .single();

    if (userError) throw userError;

    // 2. DEVICE TOKEN 저장 (fcm_token → device_tokens 이동)
    if (token) {
      const { error: tokenError } = await supabase.from("device_tokens").upsert(
        {
          user_id: user.id,
          token,
          device_os: device_os || "unknown",
          is_active: true,
          updated_at: new Date(),
        },
        { onConflict: "token" },
      );

      if (tokenError) throw tokenError;
    }

    return res.json({
      success: true,
      data: user,
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
// ===============================
// TOKEN UPDATE (device_tokens 기준)
// ===============================
exports.registerToken = async (req, res) => {
  try {
    const { phone, token, device_os } = req.body;

    if (!phone || !token) {
      return res.status(400).json({
        success: false,
        message: "phone and token are required",
      });
    }

    // 1. user 조회
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("phone", phone)
      .single();

    if (userError) throw userError;

    // 2. device_tokens upsert
    const { data, error } = await supabase
      .from("device_tokens")
      .upsert(
        {
          user_id: user.id,
          token,
          device_os: device_os || "unknown",
          is_active: true,
          updated_at: new Date(),
        },
        { onConflict: "token" },
      )
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
      .from("device_tokens")
      .select(
        `
        token,
        device_os,
        is_active,
        users (
          id,
          name,
          phone,
          country_code,
          region_code,
          role,
          is_active
        )
      `,
      )
      .eq("token", token)
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
