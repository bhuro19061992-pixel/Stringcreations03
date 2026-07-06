import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ADMIN_TOKEN_KEY = "sc03_admin_token";

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY) || "";
export const setAdminToken = (t) => localStorage.setItem(ADMIN_TOKEN_KEY, t);
export const clearAdminToken = () => localStorage.removeItem(ADMIN_TOKEN_KEY);

const authHeaders = () => ({ headers: { "X-Admin-Token": getAdminToken() } });

export const api = {
  // public
  getSettings: () => axios.get(`${API}/settings`).then((r) => r.data),
  getProducts: () => axios.get(`${API}/products`).then((r) => r.data),

  // admin
  verifyAdmin: (token) =>
    axios
      .post(`${API}/admin/verify`, {}, { headers: { "X-Admin-Token": token } })
      .then((r) => r.data),
  updateSettings: (body) => axios.put(`${API}/settings`, body, authHeaders()).then((r) => r.data),
  createProduct: (body) => axios.post(`${API}/products`, body, authHeaders()).then((r) => r.data),
  updateProduct: (id, body) =>
    axios.put(`${API}/products/${id}`, body, authHeaders()).then((r) => r.data),
  deleteProduct: (id) => axios.delete(`${API}/products/${id}`, authHeaders()).then((r) => r.data),
};

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
