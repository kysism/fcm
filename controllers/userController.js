const supabase = require("../services/supabaseService");

// token 저장 (너 기존 코드 유지 + 확장)
exports.registerToken = async (req, res) => {
  const { token } = req.body;

  const { data, error } = await supabase
    .from("users")
    .upsert({ fcm_token: token })
    .select();

  if (error) return res.status(500).send(error);

  res.send(data);
};
