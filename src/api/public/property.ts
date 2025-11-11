/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api/axios";

/**
 * @param id Property ID
 */
export const getSingleProperty = async (id: number | string) => {
  try {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching property details:", error);
    throw error;
  }
};
