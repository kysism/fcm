const crypto = require("crypto");

const supabase = require("../services/supabaseService");
const { sendToDevice } = require("../services/firebaseService");

// ⚠️ 메모리 기반 (서버 재시작 시 초기화됨)
let currentPassword = null;

// =========================
// GENERATE PASSWORD
// =========================
exports.generatePassword = async (req, res) => {
  try {
    // 1. admin 조회
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

    // 2. 🔥 admin 존재 여부 체크 (핵심)
    if (!admins || admins.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Admin이 존재하지 않습니다. 먼저 Admin을 등록하세요.",
        adminExists: false,
      });
    }

    // 3. 새 비밀번호 생성
    currentPassword = crypto.randomBytes(4).toString("hex");

    let sentCount = 0;

    // 4. FCM 발송
    for (const admin of admins) {
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

      sentCount++;
    }

    // 5. 🔥 token 없는 경우 방어
    if (sentCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Admin은 존재하지만 device token이 없습니다.",
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
// VERIFY PASSWORD
// =========================
exports.verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // 1. admin 존재 체크
    const { data: admins, error } = await supabase
      .from("users")
      .select("id")
      .eq("role", "admin");

    if (error) throw error;

    if (!admins || admins.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Admin not found. Please register admin first.",
      });
    }

    // 2. password 검증
    if (!currentPassword || password !== currentPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // 3. 성공
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
