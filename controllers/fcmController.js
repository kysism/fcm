const supabase = require("../services/supabaseService");
const { sendToDevice } = require("../services/firebaseService");

// =====================
// SEND PUSH
// =====================
exports.sendPush = async (req, res) => {
  try {
    const payload = req.body;

    // FCM SEND
    const result = await sendToDevice(payload);

    // SAVE LOG
    await supabase.from("push_messages").insert({
      title: payload.message.data.title,
      body: payload.message.data.body,
      country_code: payload.country_code || null,
      region_code: payload.region_code || null,
      created_by: "admin",
    });

    return res.send({
      success: true,
      result,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};
