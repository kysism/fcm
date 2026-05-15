const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ==========================
// 1. Firebase Admin 초기화
// ==========================
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ==========================
// 2. 단일 기기 Push (Token)
// ==========================
async function sendToDevice(token, title, body) {
  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
    android: {
      priority: "high",
    },
  };

  return await admin.messaging().send(message);
}

// ==========================
// 3. Topic Push (전체/그룹)
// ==========================
async function sendToTopic(topic, title, body) {
  const message = {
    topic: topic,
    notification: {
      title: title,
      body: body,
    },
    android: {
      priority: "high",
    },
  };

  return await admin.messaging().send(message);
}

// ==========================
// 4. API: 단일 Push
// ==========================
app.post("/send", async (req, res) => {
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
});

// ==========================
// 5. API: Topic Push
// ==========================
app.post("/send-topic", async (req, res) => {
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
});

// ==========================
// 6. 테스트 API
// ==========================
app.get("/", (req, res) => {
  res.send("FCM Server is running");
});

// ==========================
// 7. 서버 실행
// ==========================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`FCM server running on port ${PORT}`);
});
