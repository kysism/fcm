const admin = require("firebase-admin");

// ===============================
// INIT
// ===============================
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

// ===============================
// SAFE DATA BUILDER
// ===============================
const buildData = (title, body, level = 3, extra = {}) => {
  return {
    title: String(title || ""),
    body: String(body || ""),
    level: String(level),
    ...Object.fromEntries(
      Object.entries(extra || {}).map(([k, v]) => [k, String(v)]),
    ),
  };
};

// ===============================
// DEVICE PUSH (TOKEN)
// ===============================
const sendToDevice = async (token, title, body, level = 3, data = {}) => {
  try {
    return await admin.messaging().send({
      token,

      // ❗ 중요: data-only 방식 (Flutter 완전 제어)
      data: buildData(title, body, level, data),

      android: {
        priority: "high",
        ttl: 3600 * 1000,
      },

      apns: {
        headers: {
          "apns-priority": "10",
        },
      },
    });
  } catch (err) {
    console.error("sendToDevice error:", err);
    throw err;
  }
};

// ===============================
// TOPIC PUSH
// ===============================
const sendToTopic = async (topic, title, body, level = 3, data = {}) => {
  try {
    return await admin.messaging().send({
      topic,

      data: buildData(title, body, level, data),

      android: {
        priority: "high",
        ttl: 3600 * 1000,
      },

      apns: {
        headers: {
          "apns-priority": "10",
        },
      },
    });
  } catch (err) {
    console.error("sendToTopic error:", err);
    throw err;
  }
};

// ===============================
// EXPORT
// ===============================
module.exports = {
  sendToDevice,
  sendToTopic,
};
