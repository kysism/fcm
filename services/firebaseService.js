const admin = require("firebase-admin");

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
// SEND TO DEVICE
// =============================
const sendToDevice = async (token, title, body, level = 3, data = {}) => {
  return await admin.messaging().send({
    token,

    // 🚨 notification 제거
    data: {
      title: title || "",
      body: body || "",
      level: String(level),

      click_action: "FLUTTER_NOTIFICATION_CLICK",

      ...Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)]),
      ),
    },

    android: {
      priority: "high",
    },

    apns: {
      payload: {
        aps: {
          contentAvailable: true,
        },
      },
    },
  });
};

// =============================
// SEND TO TOPIC
// =============================
const sendToTopic = async (topic, title, body, level = 3, data = {}) => {
  return await admin.messaging().send({
    topic,

    // 🚨 notification 제거
    data: {
      title: title || "",
      body: body || "",
      level: String(level),

      ...Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)]),
      ),
    },

    android: {
      priority: "high",
    },

    apns: {
      payload: {
        aps: {
          contentAvailable: true,
        },
      },
    },
  });
};

module.exports = {
  sendToDevice,
  sendToTopic,
};
