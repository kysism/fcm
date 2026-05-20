const supabase = require("../services/supabaseService");

// ===============================
// USER REGISTER (UPSERT + DEVICE TOKEN)
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

    // =========================
    // 1. USER UPSERT
    // =========================
    const { data: user, error: userError } = await supabase
      .from("users")
      .upsert(
        {
          name,
          phone,
          country_code,
          region_code,
          role: role || "user",
          is_active: true,
          updated_at: new Date(),
        },
        { onConflict: "phone" },
      )
      .select()
      .single();

    if (userError) throw userError;

    // =========================
    // 2. DEVICE TOKEN UPSERT
    // =========================
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
// UPDATE DEVICE TOKEN ONLY
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

    // =========================
    // 1. GET USER
    // =========================
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("phone", phone)
      .single();

    if (userError) throw userError;

    // =========================
    // 2. UPSERT DEVICE TOKEN
    // =========================
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

// ===============================
// GET USER BY TOKEN (JOIN)
// ===============================
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
          is_active,
          created_at
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

// ===============================
// GET USER BY PHONE (🔥 MISSING BUT CRITICAL)
// ===============================
exports.getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "phone is required",
      });
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
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

// ===============================
// GET USERS LIST
// ===============================
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
