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
    const result = await sendToDevice(
      token,
      title,
      body,
      level ?? 3,
      data ?? {},
    );

    return res.send({ success: true, result });
  } catch (err) {
    return res.status(500).send({ success: false, error: err.message });
  }
};

// =====================
// TOPIC PUSH
// =====================
exports.sendTopic = async (req, res) => {
  const { topic, title, body, level, data } = req.body;

  if (!topic) {
    return res.status(400).send({ error: "topic required" });
  }

  try {
    const result = await sendToTopic(
      topic,
      title,
      body,
      level ?? 3,
      data ?? {},
    );

    return res.send({ success: true, result });
  } catch (err) {
    return res.status(500).send({ success: false, error: err.message });
  }
};
