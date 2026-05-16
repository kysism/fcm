const { sendToDevice, sendToTopic } = require("../services/firebaseService");

// =====================
// DEVICE PUSH
// =====================
exports.sendPush = async (req, res) => {
  const { token, title, body, level, data } = req.body;

  if (!token) {
    return res.status(400).send({ error: "token required" });
  }

  try {
    const result = await sendToDevice(token, title, body, level, data || {});

    res.send({ success: true, result });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
};

// =====================
// TOPIC PUSH
// =====================
exports.sendTopic = async (req, res) => {
  const { target, title, body, level, data } = req.body;

  if (!target) {
    return res.status(400).send({ error: "target required" });
  }

  try {
    const result = await sendToTopic(target, title, body, level, data || {});

    res.send({ success: true, result });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
};
