import axios from "axios";

const api = axios.create({
  // Using relative path lets Vite's server proxy (vite.config.js) handle the request.
  // This bypasses browser self-signed SSL certificate blocks.
  baseURL: "/",
});

export default api;
