const supabase = require("../services/supabaseService");

// ===============================
// REGISTER (UPSERT)
// ===============================
exports.register = async (req, res) => {
  try {
    const {
      name,
      phone,
      country_code,
      region_code,
      role,
      token,
      device_os,
      device_model,
      os_version,
      app_version,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "name and phone are required",
      });
    }

    // ======================
    // USER UPSERT
    // ======================
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

          // 🔥 추가
          last_login: new Date(),

          updated_at: new Date(),
        },
        { onConflict: "phone" },
      )
      .select()
      .single();

    if (userError) throw userError;

    // ======================
    // DEVICE TOKEN UPSERT
    // ======================
    if (token) {
      const { error: tokenError } = await supabase.from("device_tokens").upsert(
        {
          user_id: user.id,
          token,

          device_os: device_os || "unknown",
          device_model: device_model || null,
          os_version: os_version || null,
          app_version: app_version || null,

          is_active: true,
          updated_at: new Date(),
        },
        {
          onConflict: "token",
        },
      );

      if (tokenError) throw tokenError;
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err);
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
// GET USER BY TOKEN (JOIN USERS)
// ===============================
// ===============================
// GET USER BY TOKEN (JOIN USERS)
// ===============================
exports.getUserByToken = async (req, res) => {
  try {
    const { token } = req.query;

    const { data, error } = await supabase
      .from("device_tokens")
      .select(
        `
        token,
        device_os,
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

    // =========================
    // 🔥 LAST LOGIN UPDATE 추가
    // =========================
    if (data?.users?.id) {
      await supabase
        .from("users")
        .update({
          last_login: new Date(),
          updated_at: new Date(),
        })
        .eq("id", data.users.id);
    }

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
// USERS LIST (JOIN COUNTRY + REGION)
// ===============================
exports.getUsers = async (req, res) => {
  try {
    const { country_code, region_code, role, is_active } = req.query;

    // =========================
    // COUNTRY REQUIRED
    // =========================
    if (!country_code || country_code === "all") {
      return res.json({
        success: true,
        data: [],
        message: "country_code is required",
      });
    }

    // =========================
    // JOIN QUERY (countries, regions)
    // =========================
    let query = supabase
      .from("users")
      .select(
        `
        id,
        name,
        phone,
        role,
        is_active,
        created_at,

        country:countries!users_country_code_fkey (
          code,
          name
        ),

        region:regions!users_region_code_fkey (
          code,
          name
        ),

        device_tokens(token)
      `,
      )
      .eq("country_code", country_code)
      .order("name", { ascending: true });

    // =========================
    // FILTERS
    // =========================
    if (region_code && region_code !== "all") {
      query = query.eq("region_code", region_code);
    }

    if (role && role !== "all") {
      query = query.eq("role", role);
    }

    if (is_active && is_active !== "all") {
      query = query.eq("is_active", is_active === "true");
    }

    const { data, error } = await query;

    if (error) throw error;

    // =========================
    // FLATTEN RESULT
    // =========================
    const result = data.map((u) => ({
      id: u.id,
      name: u.name,
      phone: u.phone,
      role: u.role,
      is_active: u.is_active,
      created_at: u.created_at,

      country_code: u.country?.code || null,
      country_name: u.country?.name || null,

      region_code: u.region?.code || null,
      region_name: u.region?.name || null,

      fcm_token: u.device_tokens?.[0]?.token || null,
    }));

    return res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
