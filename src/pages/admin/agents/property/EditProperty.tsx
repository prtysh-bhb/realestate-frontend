/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { getPropertyById, updateProperty } from "@/api/agent/property";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [removeImages, setRemoveImages] = useState<number[]>([]);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const property = await getPropertyById(Number(id));
        setFormData(property);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    setRemoveImages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // ✅ Convert amenities (string → array)
      if (formData.amenities && typeof formData.amenities === "string") {
        const arr = formData.amenities
          .split(",")
          .map((a: string) => a.trim())
          .filter((a: string) => a.length > 0);
        formData.amenities = arr;
      }

      const data = new FormData();
      formData.images = [];
      formData.documents = [];

      // Append fields
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (Array.isArray(formData[key])) {
            formData[key].forEach((val: any) =>
              data.append(`${key}[]`, val)
            );
          } else {
            data.append(key, formData[key]);
          }
        }
      }

      // Append removed and new images
      removeImages.forEach((i) => data.append("remove_images[]", i.toString()));
      newImages.forEach((file) => data.append("images[]", file));

      await updateProperty(Number(id), data, true);
      toast.success("Property updated successfully!");
      navigate("/admin/agents/property/list");
    } catch (err) {
      console.error(err);
      toast.error(" Failed to update property.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="text-center py-10 text-gray-500">
          Loading property...
        </div>
      </AdminLayout>
    );

  if (!formData)
    return (
      <AdminLayout>
        <div className="text-center py-10 text-red-500">
          Property not found.
        </div>
      </AdminLayout>
    );

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return "https://placehold.co/400x300?text=No+Image";
    if (path.startsWith("http")) return path;
    const clean = path.replace(/^public\//, "").replace(/^storage\//, "");
    return `${import.meta.env.VITE_BACKEND_URL}/storage/${clean}`;
  };

  return (
    <AdminLayout>
      <div className="bg-white p-8 rounded-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          🏠 Edit Property
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ---------- Property Info ---------- */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Property Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Title" name="title" value={formData.title} onChange={handleChange} required />
              <InputField label="Property Type" name="property_type" value={formData.property_type} onChange={handleChange} required />
              <InputField label="Price ($)" name="price" type="number" value={formData.price} onChange={handleChange} required />
              <InputField label="Area (sqft)" name="area" type="number" value={formData.area} onChange={handleChange} required />
              <InputField label="Bedrooms" name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} required />
              <InputField label="Bathrooms" name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} required />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full border rounded-md p-3 text-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
          </div>

          {/* ---------- Location Info ---------- */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Location Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Address" name="address" value={formData.address} onChange={handleChange} required />
              <InputField label="Location" name="location" value={formData.location} onChange={handleChange} required />
              <InputField label="City" name="city" value={formData.city} onChange={handleChange} required />
              <InputField label="State" name="state" value={formData.state} onChange={handleChange} required />
              <InputField label="Zip Code" name="zipcode" value={formData.zipcode} onChange={handleChange} required />
            </div>
          </div>

          {/* ---------- Amenities ---------- */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Amenities
            </h2>
            <Input
              name="amenities"
              value={
                Array.isArray(formData.amenities)
                  ? formData.amenities.join(", ")
                  : formData.amenities || ""
              }
              onChange={handleChange}
              placeholder="Enter amenities (comma-separated, e.g. Gym, Pool, Garden)"
              className="border-gray-300"
            />
          </div>

          {/* ---------- Existing Images ---------- */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Existing Images
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.images && formData.images.length > 0 ? (
                formData.images.map((img: string, i: number) => (
                  <div key={i} className="relative">
                    <img
                      src={getImageUrl(img)}
                      alt={`Property ${i}`}
                      className={`w-full h-40 object-cover rounded-lg border ${
                        removeImages.includes(i)
                          ? "opacity-40 border-red-400"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(i)}
                      className={`absolute top-2 right-2 bg-white border rounded-full text-sm px-2 py-1 shadow ${
                        removeImages.includes(i)
                          ? "text-red-600 border-red-400"
                          : "text-gray-700 border-gray-300 hover:bg-red-50"
                      }`}
                    >
                      {removeImages.includes(i) ? "Undo" : "Remove"}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm col-span-full">
                  No existing images.
                </p>
              )}
            </div>
          </div>

          {/* ---------- Add New Images ---------- */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Images
            </h2>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
            {newImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {newImages.map((file, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New ${i}`}
                      className="w-full h-40 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(i)}
                      className="absolute top-2 right-2 bg-white border rounded-full text-sm px-2 py-1 shadow text-gray-700 border-gray-300 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ---------- Status Section ---------- */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { label: "Draft", value: "draft" },
                  { label: "Published", value: "published" },
                  { label: "Sold", value: "sold" },
                  { label: "Rented", value: "rented" },
                ]}
              />
              <SelectField
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                  { label: "For Sale", value: "sale" },
                  { label: "For Rent", value: "rent" },
                ]}
              />
            </div>
          </div>

          {/* ---------- Submit ---------- */}
          <div className="flex justify-center md:justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md"
            >
              {saving ? "Updating..." : "Update Property"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

// ✅ Helper Components
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: any) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
    </label>
    <Input
      name={name}
      value={value || ""}
      onChange={onChange}
      type={type}
      required={required}
      className="border-gray-300"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full border p-2 rounded-md text-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500"
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default EditProperty;
