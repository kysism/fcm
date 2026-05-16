const supabase = require("../services/supabaseService");

// ===============================
// FCM token 업데이트
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
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
