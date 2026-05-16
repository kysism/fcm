const supabase = require("../services/supabaseService");
const { sendToDevice, sendToTopic } = require("../services/firebaseService");

// =====================
// 단일 Push (기존 /send)
// =====================
exports.sendPush = async (req, res) => {
  const { token, title, body } = req.body;

  if (!token) {
    return res.status(400).send({ error: "token required" });
  }

  try {
    const result = await sendToDevice(token, title, body);
    res.send({ success: true, result });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
};

// =====================
// Topic Push (기존 /send-topic)
// =====================
exports.sendTopic = async (req, res) => {
  const { topic, title, body } = req.body;

  if (!topic) {
    return res.status(400).send({ error: "topic required" });
  }

  try {
    const result = await sendToTopic(topic, title, body);
    res.send({ success: true, result });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
};
