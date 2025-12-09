import api from "@/api/axios";


export interface Blog {
  views_count: number;
  featured_image_url?: string | null;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  id: number;
  title: string;
  content: string;
  image: string | null;
  category_id: number | null;
  image_url?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BlogFormData{
  title: string;
  content: string;
  category_id: number | null;
  featured_image?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  image?: string | null;
  status: string;
}

export interface NewsFormData{
  title: string;
  content: string;
  image?: string | null;
  status: number;
}

export interface BlogResponse {
  success: boolean;
  message?: string;
  data: Blog;
}

export interface BlogListResponse {
  success: boolean;
  data: Blog[];
}

// =============================
// Blog Categories Interfaces
// =============================
export interface BlogCategory {
  id: number;
  name: string;
  content: string;
  is_active: boolean;
  blogs_count: number;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface BlogCategoryFormData{
  name: string;
  content: string;
  is_active: boolean;
}

export interface BlogCategoryResponse {
  success: boolean;
  message?: string;
  data: BlogCategory;
}

export interface BlogCategoryListResponse {
  success: boolean;
  data: BlogCategory[];
}


export const getBlogs = async () => {
  const response = await api.get<BlogListResponse>("/agent/blogs");
  return response.data;
};

export const getBlog = async (id: number) => {
  const response = await api.get<BlogResponse>(`/agent/blogs/${id}`);
  return response.data;
};

export const createBlog = async (form: FormData) => {
  const response = await api.post<BlogResponse>("/agent/blogs", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateBlog = async (id: number, form: FormData) => {
  form.append('_method', 'PUT');

  const response = await api.post<BlogResponse>(`/agent/blogs/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteBlog = async (id: number) => {
  const response = await api.delete(`/agent/blogs/${id}`);
  return response.data;
};

export const updateBlogStatus = async (id: number) => {
  const response = await api.post(`/agent/blogs/update-status/${id}`);
  return response.data;
};


export const getBlogCategories = async () => {
  const response = await api.get<BlogCategoryListResponse>("/agent/blogs/categories");
  return response.data;
};