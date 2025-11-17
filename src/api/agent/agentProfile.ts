import api from "@/api/axios";
import { ReactNode } from "react";

export interface AgentProfile {
  bio: ReactNode;
  total_properties: ReactNode;
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
  image?: string | null;
  phone?: string | null;
  location?: string | null;
}

interface AgentProfileResponse {
  success: boolean;
  message: string;
  data: {
    agent: AgentProfile;
  };
}

export const fetchAgentProfile = async (id: string) => {
  const response = await api.get<AgentProfileResponse>(`/admin/agents/${id}`);
  const res = response.data;

  return {
    success: res.success,
    data: res.data.agent, // ✅ flattened
  };
};
