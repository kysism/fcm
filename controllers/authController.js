const crypto = require("crypto");

const supabase = require("../services/supabaseService");
const { sendToDevice } = require("../services/firebaseService");

// 메모리 저장 (서버 재시작 시 초기화됨)
let currentPassword = null;

// =========================
// GENERATE PASSWORD (SAFE VERSION)
// =========================
exports.generatePassword = async (req, res) => {
  try {
    // 1. admin 목록 조회 (단순화 - relation 제거로 500 방지)
    const { data: admins, error: adminError } = await supabase
      .from("users")
      .select("id, name, role")
      .eq("role", "admin");

    if (adminError) {
      console.error("SUPABASE ERROR:", adminError);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    // 2. admin 없음 방어
    if (!admins || admins.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Admin이 존재하지 않습니다. 먼저 Admin을 등록하세요.",
        adminExists: false,
      });
    }

    // 3. 비밀번호 생성
    currentPassword = crypto.randomBytes(4).toString("hex");

    let sentCount = 0;

    // 4. admin별 token 안전 조회 + FCM 전송
    for (const admin of admins) {
      try {
        const { data: tokens, error: tokenError } = await supabase
          .from("device_tokens")
          .select("token")
          .eq("user_id", admin.id);

        if (tokenError) {
          console.error("TOKEN ERROR:", tokenError);
          continue;
        }

        const token = tokens?.[0]?.token;

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
      } catch (err) {
        // 🔥 한 admin 실패해도 전체 중단 안 함
        console.error("FCM SEND ERROR:", err);
        continue;
      }
    }

    // 5. token 없음 방어
    if (sentCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Admin은 존재하지만 유효한 device token이 없습니다.",
      });
    }

    return res.json({
      success: true,
    });
  } catch (err) {
    console.error("GEN PASSWORD ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      detail: err.message,
    });
  }
};

// =========================
// VERIFY PASSWORD (SAFE VERSION)
// =========================
exports.verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;

    // 1. 입력값 체크
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // 2. admin 존재 체크
    const { data: admins, error } = await supabase
      .from("users")
      .select("id")
      .eq("role", "admin");

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (!admins || admins.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Admin not found. Please register admin first.",
      });
    }

    // 3. password 검증 (메모리 기반)
    if (!currentPassword || password !== currentPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    return res.json({
      success: true,
    });
  } catch (err) {
    console.error("VERIFY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      detail: err.message,
    });
  }
};
