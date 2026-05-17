const { sendToDevice, sendToTopic } = require("../services/firebaseService");

// =====================
// DEVICE PUSH (FIXED)
// =====================
exports.sendPush = async (req, res) => {
  try {
    const payload = req.body;

    const result = await sendToDevice(payload);

    return res.send({ success: true, result });
  } catch (err) {
    return res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};

// =====================
// TOPIC PUSH (FIXED)
// =====================
exports.sendTopic = async (req, res) => {
  try {
    const payload = req.body;

    const result = await sendToTopic(payload);

    return res.send({ success: true, result });
  } catch (err) {
    return res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};
