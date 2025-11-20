import axios from 'axios';


const API_BASE = import.meta.env.VITE_API_URL;


function getAuthHeaders(token?: string | null) {
const t = token ?? localStorage.getItem('token');
return t ? { Authorization: `Bearer ${t}` } : {};
}


export const fetchAgentProperties = async (token?: string | null) => {
const resp = await axios.get(`${API_BASE}/agent/properties`, { headers: getAuthHeaders(token), params: { per_page: 200 } });
return resp.data?.data ?? resp.data;
};


export const fetchAgentCustomers = async (token?: string | null) => {
// try multiple endpoints (some installs expose different routes)
const endpoints = [`${API_BASE}/agent/customers`, `${API_BASE}/customers`, `${API_BASE}/admin/customers`];
for (const url of endpoints) {
try {
const resp = await axios.get(url, { headers: getAuthHeaders(token), params: { per_page: 200 } });
return resp.data?.data ?? resp.data;
} catch (err: any) {
if (err?.response?.status === 404 || err?.response?.status === 403) continue;
throw err;
}
}
return [];
};


export const fetchAppointments = async (page = 1, per_page = 12, token?: string | null) => {
const resp = await axios.get(`${API_BASE}/agent/appointments`, { headers: getAuthHeaders(token), params: { page, per_page } });
return resp.data?.data ?? resp.data;
};


export const fetchAppointment = async (id: number, token?: string | null) => {
const resp = await axios.get(`${API_BASE}/agent/appointments/${id}`, { headers: getAuthHeaders(token) });
return resp.data?.data?.appointment ?? resp.data?.appointment ?? resp.data;
};


export const createAppointment = async (payload: any, token?: string | null) => {
const resp = await axios.post(`${API_BASE}/agent/appointments`, payload, { headers: { ...getAuthHeaders(token), 'Content-Type': 'application/json' } });
return resp.data;
};


export const updateAppointment = async (id: number, payload: any, token?: string | null) => {
const resp = await axios.put(`${API_BASE}/agent/appointments/${id}`, payload, { headers: { ...getAuthHeaders(token), 'Content-Type': 'application/json' } });
return resp.data;
};


export const cancelAppointment = async (id: number, reason: string, token?: string | null) => {
const resp = await axios.post(`${API_BASE}/agent/appointments/${id}/cancel`, { cancellation_reason: reason }, { headers: getAuthHeaders(token) });
return resp.data;
};


export const checkAvailability = async (date: string, token?: string | null) => {
const resp = await axios.get(`${API_BASE}/agent/appointments/availability/check`, { headers: getAuthHeaders(token), params: { date } });
return resp.data?.data ?? resp.data;
};