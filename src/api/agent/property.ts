/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api/axios";

export interface Property {
  id: number;
  title: string;
  description?: string;
  price: number;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  type: string;
  property_type?: string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  area?: number | string;
  status: string;
  approval_status?: string;
  rejection_reason?: string | null;
  amenities: [];
  images: [];
  image_urls: [];
  created_at?: string;
  updated_at?: string;
}

// Response wrapper
interface PropertyResponse {
  id: any;
  success: boolean;
  message: string;
  data: {
    data: any;
    property?: Property;
    properties?: Property[];
    pagination?: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
}

// ✅ 1️⃣ Get all properties for the logged-in agent (paginated)
export const getAgentProperties = async (page = 1) => {
  const res = await api.get<PropertyResponse>(`/agent/properties?page=${page}`);
  return res.data.data;
};

// ✅ 2️⃣ Get specific property details by ID
export const getPropertyById = async (id: number) => {
  const res = await api.get<PropertyResponse>(`/agent/properties/${id}`);
  return res.data.data.property;
};

// ✅ 3️⃣ Create new property (supports images & amenities)
export const createProperty = async (data: FormData | Partial<Property>) => {
  // If data is plain object, convert it to FormData
  let payload: FormData;
  if (data instanceof FormData) {
    payload = data;
  } else {
    payload = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        payload.append(key, String(value));
      }
    });
  }

  const res = await api.post<PropertyResponse>(`/agent/properties`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ✅ 4️⃣ Update property by ID (also supports image re-upload)
export const updateProperty = async (
  id: number,
  data: FormData | Partial<Property>,
  p0?: boolean
) => {
  let payload: FormData;
  if (data instanceof FormData) {
    payload = data;
  } else {
    payload = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        payload.append(key, String(value));
      }
    });
  }

  const res = await api.post<PropertyResponse>(
    `/agent/properties/${id}?_method=PUT`,
    payload,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
};

// ✅ 5️⃣ Delete property
export const deleteProperty = async (id: number) => {
  const res = await api.delete<PropertyResponse>(`/agent/properties/${id}`);
  return res.data;
};
