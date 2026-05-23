const supabase = require("../services/supabaseService");
const { sendToDevice } = require("../services/firebaseService");

// =====================
// SEND PUSH
// =====================
exports.sendPush = async (req, res) => {
  try {
    const payload = req.body;

    // FCM SEND ONLY
    const result = await sendToDevice(payload);

    return res.send({
      success: true,
      result,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};
