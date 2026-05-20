const { sendToDevice } = require("../services/firebaseService");

// =====================
// DEVICE PUSH ONLY (SAFE)
// =====================
exports.sendPush = async (req, res) => {
  try {
    const { message } = req.body;

    // ======================
    // VALIDATION
    // ======================
    if (!message || !message.token) {
      return res.status(400).send({
        success: false,
        error: "message.token is required",
      });
    }

    if (!message.notification && !message.data) {
      return res.status(400).send({
        success: false,
        error: "notification or data required",
      });
    }

    // ======================
    // SEND
    // ======================
    const result = await sendToDevice({ message });

    return res.send({
      success: true,
      result,
    });
  } catch (err) {
    console.error("SEND PUSH ERROR:", err);

    return res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};
