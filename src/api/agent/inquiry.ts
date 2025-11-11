import api from "@/api/axios"; 
// ✅ Get all agent inquiries (with filters)
export const getAgentInquiries = async (params = {}) => {
  const res = await api.get("/agent/inquiries", { params });
  return res.data.data;
};

// ✅ Get inquiry details
export const getInquiryById = async (id: number) => {
  const res = await api.get(`/agent/inquiries/${id}`);
  return res.data.data.inquiry;
};

// ✅ Update stage
export const updateInquiryStage = async (id: number, stage: string, note?: string) => {
  const res = await api.put(`/agent/inquiries/${id}/stage`, { stage, note });
  return res.data.data.inquiry;
};

// ✅ Add note
export const addInquiryNote = async (id: number, note: string) => {
  const res = await api.post(`/agent/inquiries/${id}/notes`, { note });
  return res.data.data.inquiry;
};

// ✅ Get history
export const getInquiryHistory = async (id: number) => {
  const res = await api.get(`/agent/inquiries/${id}/history`);
  return res.data.data.history;
};
