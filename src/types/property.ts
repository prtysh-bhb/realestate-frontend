/**
 * Property Types
 * Property-related type definitions
 */

import type { PropertyStatus, PropertyType, PropertyCategory } from "@/constants";
import type { Agent } from "./user";

export interface DocumentFile {
  name: string;
  url: string;
  size: number;
}

export interface Property {
  id: number;
  agent_id: number;
  title: string;
  description: string;
  price: string | number;
  location: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  type: PropertyType;
  property_type: PropertyCategory;
  bedrooms: number;
  bathrooms: number;
  area: string | number;
  status: PropertyStatus;
  approval_status: "pending" | "approved" | "rejected";
  approved_by?: number;
  rejection_reason?: string | null;
  primary_image_url: string | null;
  image_urls: string[];
  document_urls: DocumentFile[];
  amenities: string[];
  agent?: Agent;
  is_favorite?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  price: string | number;
  location: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  type: PropertyType;
  property_type: PropertyCategory | "";
  bedrooms: string | number;
  bathrooms: string | number;
  area: string | number;
  status: PropertyStatus;
  amenities: string[];
}

export interface FilterState {
  keyword: string;
  location: string;
  state: string;
  city: string;
  property_type: string;
  min_price: string;
  max_price: string;
  bedrooms: string;
  bathrooms: string;
  min_area: string;
  max_area: string;
  type: string;
  amenities: string[];
  sortBy: string;
  sort_by: string;
  sort_order: string;
}

export interface FavoriteProperty {
  id: number;
  user_id: number;
  property_id: number;
  created_at: string;
  updated_at: string;
  property: Property;
}

export interface PropertyAttribute {
  key: string;
  label: string;
}

export interface PropertyAttributesData {
  amenities: PropertyAttribute[];
  property_types: PropertyAttribute[];
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface Inquiry {
  id: number;
  property_id: number;
  user_id?: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "pending" | "contacted" | "closed";
  created_at: string;
  updated_at: string;
  property?: Property;
}

export interface Documents {
  success: boolean;
  message: string;
  data: {
    documents: DocumentFile[];
  };
}
