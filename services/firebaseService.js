const admin = require("firebase-admin");

// =============================
// INIT
// =============================
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

// =============================
// EXTRACT MESSAGE (핵심)
// =============================
const extractMessage = (payload) => {
  if (!payload) return null;
  if (payload.message) return payload.message;
  return payload;
};

// =============================
// DEVICE SEND (FIXED)
// =============================
const sendToDevice = async (payload) => {
  const message = extractMessage(payload);

  if (!message?.token) {
    console.log("INVALID PAYLOAD:", JSON.stringify(payload, null, 2));
    throw new Error("token required");
  }

  const token = message.token;
  const data = message.data || {};

  return await admin.messaging().send({
    token: token,

    notification: {
      title: data.title,
      body: data.body,
    },

    data: {
      title: String(data.title || ""),
      body: String(data.body || ""),
      level: String(data.level || "3"),
    },

    android: {
      priority: "high",
    },
  });
};

// =============================
// TOPIC SEND (FIXED)
// =============================
const sendToTopic = async (payload) => {
  const message = extractMessage(payload);

  if (!message?.topic) {
    throw new Error("topic required");
  }

  const data = message.data || {};

  return await admin.messaging().send({
    topic: message.topic,

    data: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)]),
    ),

    android: {
      priority: "high",
    },
  });
};

module.exports = {
  sendToDevice,
  sendToTopic,
};
