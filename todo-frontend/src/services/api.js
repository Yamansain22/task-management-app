const API_URL = "http://localhost:5000";

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

const options = {
  method,
  headers,
};

if (body) {
  options.body = JSON.stringify(body);
}

const res = await fetch(`${API_URL}${endpoint}`, options);

  return res.json();
};
