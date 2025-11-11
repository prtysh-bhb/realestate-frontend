/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api/axios";

export interface Agent {
  company_name: string;
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  two_factor_enabled: boolean;
  created_at: string;
}

interface AgentResponse {
  success: boolean;
  message: string;
  data: {
    agents: Agent[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
}

export const getAgents = async (page = 1, search = "") => {
const response = await api.get<AgentResponse>(`/admin/agents`, {
          params: { page, search },
        });
        return response.data;
};