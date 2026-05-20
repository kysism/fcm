const supabase = require("../services/supabaseService");

// ===============================
// USER REGISTER
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
          country_code: country_code || null,
          region_code: region_code || null,

          // ⭐ 핵심: role 기본값 확실히 보장
          role: role?.trim() ? role : "user",

          is_active: true,
          updated_at: new Date(),
        },
        { onConflict: "phone" },
      )
      .select()
      .single();

    if (userError) {
      console.error("USER UPSERT ERROR:", userError);
      throw userError;
    }

    // =========================
    // 2. DEVICE TOKEN UPSERT
    // =========================
    if (token && token.trim() !== "") {
      const { error: tokenError } = await supabase.from("device_tokens").upsert(
        {
          user_id: user.id,
          token: token.trim(),
          device_os: device_os || "unknown",
          is_active: true,
          updated_at: new Date(),
        },
        { onConflict: "token" },
      );

      if (tokenError) {
        console.error("DEVICE TOKEN UPSERT ERROR:", tokenError);
        throw tokenError;
      }
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
// GET USER BY PHONE
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

// ===============================
// GET USERS LIST (🔥 안정화 핵심)
// ===============================
exports.getUsers = async (req, res) => {
  try {
    const { country_code, region_code, role, active } = req.query;

    let query = supabase
      .from("users")
      .select(
        `
        id,
        name,
        phone,
        country_code,
        region_code,
        role,
        is_active,
        created_at
      `,
      )
      .order("created_at", { ascending: false });

    // =========================
    // COUNTRY FILTER
    // =========================
    if (country_code && country_code !== "all") {
      query = query.eq("country_code", country_code);
    }

    // =========================
    // REGION FILTER
    // =========================
    if (region_code && region_code !== "all") {
      query = query.eq("region_code", region_code);
    }

    // =========================
    // ROLE FILTER
    // =========================
    if (role && role !== "all") {
      query = query.eq("role", role);
    }

    // =========================
    // ACTIVE FILTER (🔥 중요)
    // =========================
    if (active && active !== "all") {
      query = query.eq("is_active", active === "true");
    }

    const { data, error } = await query;

    if (error) {
      console.error("GET USERS ERROR:", error);
      throw error;
    }

    return res.json({
      success: true,
      count: data?.length || 0,
      data: data || [],
    });
  } catch (err) {
    console.error("GET USERS EXCEPTION:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
