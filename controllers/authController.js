const crypto = require("crypto");

const supabase = require("../services/supabaseService");

const { sendToDevice } = require("../services/firebaseService");

let currentPassword = null;

// =========================
// GENERATE PASSWORD
// =========================
exports.generatePassword = async (req, res) => {
  try {
    // 새 비밀번호 생성
    currentPassword = crypto.randomBytes(4).toString("hex");

    // admin 사용자 조회
    const { data: admins, error } = await supabase
      .from("users")
      .select(
        `
          id,
          name,
          device_tokens (
            token
          )
        `,
      )
      .eq("role", "admin");

    if (error) throw error;

    // admin push 발송
    for (const admin of admins || []) {
      const token = admin.device_tokens?.[0]?.token;

      if (!token) continue;

      await sendToDevice({
        message: {
          token,

          data: {
            title: "ADMIN PASSWORD",
            body: `Password: ${currentPassword}`,
            level: "3",
          },

          android: {
            priority: "high",
          },
        },
      });
    }

    return res.json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// VERIFY
// =========================
exports.verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
      });
    }

    if (password !== currentPassword) {
      return res.status(401).json({
        success: false,
      });
    }

    return res.json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
