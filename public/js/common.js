async function verifyLogin() {
  const API = "https://fcm-61ns.onrender.com/api";
  const password = sessionStorage.getItem("koica_admin_password");

  if (!password) {
    location.href = "/html/login.html";
    return;
  }

  const res = await fetch(`${API}/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  const json = await res.json();

  if (!json.success) {
    sessionStorage.removeItem("koica_admin_password");

    location.href = "/html/login.html";
  }
}
