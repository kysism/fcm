const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ==========================
// 1. Firebase Admin 초기화
// ==========================
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: process.env.FIREBASE_AUTH_URI,
    tokenUri: process.env.FIREBASE_TOKEN_URI,
    authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  }),
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
