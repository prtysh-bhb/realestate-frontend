/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api/axios";
import { FilterState, Property } from "@/types/property";

export interface Favorite {
  id: number;
  user_id: number;
  property_id: number;
  created_at: string;
  updated_at: string;
  property: Property;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  data: {
    inquiry: [];
  };
}

export interface FavoritesResponse {
  success: boolean;
  message?: string;
  data: {
    favorites: Favorite[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
}

export interface PropertyResponse {
  success: boolean;
  message?: string;
  data: {
    data: Property[];
    property: Property;
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}


/** 
 * Fetch properties (with pagination + search)
 */
export const getFavProperties = async (page = 1) => {
  const response = await api.get<FavoritesResponse>("/customer/favorites", {
    params: { page },
  });

  return response.data;
};

export const setFavProperties = async (id: number) => {
   try{
    const response = await api.post<FavoritesResponse>("/customer/favorites/"+id);
    return response.data;
  }catch(error: unknown){
    const axiosError = error as any;
    return {
      success: false,
      message:
        axiosError.response?.data?.message || "Failed to update favorites. Please try again.",
    };
  }
};

export const removeFavProperties = async (id: number) => {
  try{
    const response = await api.delete<FavoritesResponse>("/customer/favorites/"+id);
    return response.data;
  }catch(error: unknown){
    const axiosError = error as any;
    return {
      success: false,
      message:
        axiosError.response?.data?.message || "Failed to delete favorites. Please try again.",
    };
  }
};

export const getPropertiesByFilter = async (page = 1, filters: FilterState) => {
  const response = await api.get<PropertyResponse>("/properties/search", {
    params: { page, ...filters },
  });

  return response.data;
};

export const getProperty = async (id: number) => {
  const response = await api.get<PropertyResponse>("/properties/"+id);

  return response.data;
};

export const propertyInquiry = async (id: number, formData: InquiryFormData) => {
  const response = await api.post<InquiryResponse>("/customer/inquiries/"+id, {...formData});

  return response.data;
};