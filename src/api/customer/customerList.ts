/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/customer/customer.ts
import api from "@/api/axios";

export interface Customer {
  two_factor_enabled: any;
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface CustomerResponse {
  success: boolean;
  message: string;
  data: {
    customers: Customer[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
}

/**
 * Fetch customers (with pagination + search)
 */
export const getCustomers = async (page = 1, search = "") => {
  const response = await api.get<CustomerResponse>("/admin/customers", {
    params: { page, search },
  });
  return response.data;
};


