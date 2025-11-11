import api from "@/api/axios";

export const getPropertyDocuments = (propertyId: number) =>
  api.get(`/agent/properties/${propertyId}/documents`);

export const uploadPropertyDocuments = (propertyId: number, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("documents[]", file));
  return api.post(`/agent/properties/${propertyId}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePropertyDocument = (propertyId: number, index: number) =>
  api.delete(`/agent/properties/${propertyId}/documents`, { data: { index } });
