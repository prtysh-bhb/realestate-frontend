import api from "@/api/axios";

export interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  image?: string;
  is_active?: boolean;
  created_at?: string;
}

interface CustomerProfileResponse {
  success: boolean;
  message: string;
  data: {
    customer: CustomerProfile;
  };
}

export const fetchCustomerProfile = async (id: string) => {
  const res = await api.get<CustomerProfileResponse>(`/admin/customers/${id}`);

  return {
    success: res.data.success,
    data: res.data.data.customer,
  };
};
