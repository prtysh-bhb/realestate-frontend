export interface Agent {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
}

export interface Property {
  id: number;
  agent_id: number;
  title: string;
  description: string;
  price: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  type: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  status: string;
  approval_status: string;
  approved_by?: number;
  primary_image_url: string | null;
  image_urls: string[];
  document_urls: DocumentFile[];
  amenities: string[];
  agent: Agent;
  is_favorite: boolean;
}

export interface Documents {
  success: boolean;
  message: string;
  data: {
    documents: [];
  };
}

export interface DocumentFile {
  name: string;
  url: string;
  size: number; // in bytes
}

export interface FavoriteProperty {
  id: number;
  user_id: number;
  property_id: number;
  created_at: string;
  updated_at: string;
  property: Property;
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
}
