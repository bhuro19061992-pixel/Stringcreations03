import axios from "axios";

const API = `/api`;

const ADMIN_TOKEN_KEY = "sc03_admin_token";

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY) || "";
export const setAdminToken = (t) => localStorage.setItem(ADMIN_TOKEN_KEY, t);
export const clearAdminToken = () => localStorage.removeItem(ADMIN_TOKEN_KEY);

const authHeaders = () => ({ headers: { "X-Admin-Token": getAdminToken() } });

export const api = {
  // public
  getSettings: () => axios.get(`${API}/settings`).then((r) => r.data),
  getProducts: () => axios.get(`${API}/products`).then((r) => r.data),
 // Reviews (Public)
  getReviews: () =>
    axios.get(`${API}/reviews`).then((r) => r.data),

  createReview: (body) =>
    axios.post(`${API}/reviews`, body).then((r) => r.data),

  // Reviews (Admin)
  getAdminReviews: () =>
    axios.get(`${API}/admin/reviews`, authHeaders()).then((r) => r.data),

  approveReview: (id, approved = true) =>
    axios
      .put(`${API}/reviews/${id}`, { approved }, authHeaders())
      .then((r) => r.data),

  deleteReview: (id) =>
    axios
      .delete(`${API}/reviews/${id}`, authHeaders())
      .then((r) => r.data),
  
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
