const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

async function request(path = "", options = {}) {
  const res = await fetch(`${BASE}/siswa${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request gagal (${res.status})`);
  }
  return json;
}

export const getSiswa = () => request().then((r) => r.data);
export const createSiswa = (body) =>
  request("", { method: "POST", body: JSON.stringify(body) });
export const updateSiswa = (id, body) =>
  request(`/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteSiswa = (id) => request(`/${id}`, { method: "DELETE" });
