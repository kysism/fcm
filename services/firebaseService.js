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
// SEND RAW HTTP v1 MESSAGE
// =============================
const sendRawMessage = async (message) => {
  return await admin.messaging().send(message);
};

// =============================
// WRAPPER (DEVICE)
// =============================
const sendToDevice = async (payload) => {
  const { token, data } = payload.message || payload;

  return await admin.messaging().send({
    token,

    data: Object.fromEntries(
      Object.entries(data || {}).map(([k, v]) => [k, String(v)]),
    ),

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
// WRAPPER (TOPIC)
// =============================
const sendToTopic = async (payload) => {
  const { topic, data } = payload.message || payload;

  return await admin.messaging().send({
    topic,

    data: Object.fromEntries(
      Object.entries(data || {}).map(([k, v]) => [k, String(v)]),
    ),

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
  sendRawMessage,
  sendToDevice,
  sendToTopic,
};
