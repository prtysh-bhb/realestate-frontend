/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getPropertyDocuments,
  uploadPropertyDocuments,
  deletePropertyDocument,
} from "@/api/agent/propertyDocuments";
import {
  Loader2,
  Trash2,
  Upload,
  FileText,
  Eye,
  X,
  AlertTriangle,
} from "lucide-react";

interface Props {
  propertyId: number;
}

const PropertyDocuments = ({ propertyId }: Props) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const fetchDocuments = async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
      const res = await getPropertyDocuments(propertyId);
      setDocuments(res.data.data.documents || []);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [propertyId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    try {
      const files = Array.from(e.target.files);
      await uploadPropertyDocuments(propertyId, files);
      toast.success("Documents uploaded successfully!");
      fetchDocuments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = (index: number) => {
    setDeleteIndex(index);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (deleteIndex === null) return;
    try {
      await deletePropertyDocument(propertyId, deleteIndex);
      toast.success("Document deleted successfully");
      fetchDocuments();
    } catch {
      toast.error("Failed to delete document");
    } finally {
      setShowConfirm(false);
      setDeleteIndex(null);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Property Documents
        </h3>

        <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={16} /> Uploading...
            </>
          ) : (
            <>
              <Upload size={16} /> Upload
            </>
          )}
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </label>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm flex items-center gap-2">
          <Loader2 className="animate-spin" size={16} /> Loading documents...
        </p>
      ) : documents.length > 0 ? (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, index) => {
            const fileUrl = doc.url;
            const isImage = /\.(jpg|jpeg|png)$/i.test(doc.name);

            return (
              <li
                key={index}
                className="relative group border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
              >
                {isImage ? (
                  <img
                    src={fileUrl}
                    alt={doc.name}
                    className="h-32 w-full object-cover rounded-md"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-700 py-10 justify-center">
                    <FileText className="text-blue-500" size={24} />
                    <span className="text-sm font-medium truncate">
                      {doc.name}
                    </span>
                  </div>
                )}

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                  >
                    <Eye size={14} />
                  </a>
                  <button
                    onClick={() => confirmDelete(index)}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="mt-2 text-xs text-gray-600 truncate">
                  {doc.name}
                </div>
                <div className="text-xs text-gray-400">
                  {doc.size ? `${(doc.size / 1024 / 1024).toFixed(2)} MB` : "—"}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4 text-sm">
          No documents uploaded yet.
        </p>
      )}

      {/* ✅ Popup Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="text-yellow-500" size={20} />
                Confirm Delete
              </h4>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              Are you sure you want to delete this document? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDocuments;
