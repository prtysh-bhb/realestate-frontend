import { ApiResponse, Inquiry } from '@/types';
import { Customer, Property } from '@/types/appointment';
import axios from 'axios';

export interface AppointmentResponse{
    success: boolean;
    message: string;
    data: {
        appointment: Appointment;
    };
}

export interface AppointmentListResponse{
    success: boolean;
    message: string;
    data: {
        appointments: Appointment[];
    };
}

export interface TimeSlot {
  start_time: string;      // "09:00"
  end_time: string;        // "09:30"
  datetime: string;        // ISO string
  is_available: boolean;
}

export interface TimeSlotsResponse {
  success: boolean;
  data: {
    date: string;          // "2025-01-18"
    time_slots: TimeSlot[];
  };
}

export interface Appointment {
  id: number;
  property_id: number | null;
  agent_id: number | null;
  customer_id: number | null;
  inquiry_id: number | null;

  type: string | null;
  scheduled_at: string | null;   // ISO datetime from Laravel
  duration_minutes: number | null;

  status: string | null;
  notes: string | null;
  customer_notes: string | null;
  agent_notes: string | null;

  location: string | null;
  phone_number: string | null;

  confirmed_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;

  cancelled_by: number | null;
  cancellation_reason: string | null;

  // Relationships
  property?: Property | null;
  customer?: Customer | null;
  inquiry?: Inquiry | null;
}

export interface CustomersResponse {
  success: boolean;
  message: string;
  data: {
    customers: Customer[];
  };
}


const API_BASE = import.meta.env.VITE_API_URL;


function getAuthHeaders(token?: string | null) {
const t = token ?? localStorage.getItem('token');
return t ? { Authorization: `Bearer ${t}` } : {};
}


export const fetchAgentCustomers = async (token?: string | null) => {
// try multiple endpoints (some installs expose different routes)
const endpoints = [`${API_BASE}/agent/customers`, `${API_BASE}/customers`, `${API_BASE}/admin/customers`];
for (const url of endpoints) {
try {
const resp = await axios.get<CustomersResponse>(url, { headers: getAuthHeaders(token), params: { per_page: 200 } });
return resp.data?.data.customers;
} catch (err: any) {
if (err?.response?.status === 404 || err?.response?.status === 403) continue;
throw err;
}
}
return [];
};


export const fetchAppointments = async (page = 1, per_page = 12, token?: string | null) => {
const resp = await axios.get<AppointmentListResponse>(`${API_BASE}/agent/appointments`, { headers: getAuthHeaders(token), params: { page, per_page } });
return resp.data?.data ?? resp.data;
};


export const fetchAppointment = async (id: number, token?: string | null) => {
const resp = await axios.get<AppointmentResponse>(`${API_BASE}/agent/appointments/${id}`, { headers: getAuthHeaders(token) });
return resp.data?.data?.appointment ?? resp.data;
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
const resp = await axios.get<TimeSlotsResponse>(`${API_BASE}/agent/appointments/availability/check`, { headers: getAuthHeaders(token), params: { date } });
return resp.data?.data ?? resp.data;
};