/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import {
  getPropertyById,
  updateProperty,
} from "@/api/agent/property";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Attributes, propertyAttributes, PropertyFormData } from "@/api/customer/properties";
import { validateImage } from "@/helpers/image_helper";

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData | null>({
      title: "",
      description: "",
      price: "",
      location: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      type: "sale",
      property_type: "",
      bedrooms: "",
      bathrooms: "",
      area: '',
      status: "draft",
      amenities: [],
    });
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [removeImages, setRemoveImages] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [amenities, setAmenities] = useState<Attributes[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<Attributes[]>([]);

  // Fetch property + attributes
  useEffect(() => {
    const loadData = async () => {
      try {
        const [propertyRes, attrRes] = await Promise.all([
          getPropertyById(Number(id)),
          propertyAttributes(),
        ]);

        const property = propertyRes;
        
        // Normalize property fields to match formData shape
        const normalizedProperty: PropertyFormData = {
          title: property?.title || "",
          description: property?.description || "",
          price: property?.price || "",
          location: property?.location || "",
          address: property?.address || "",
          city: property?.city || "",
          state: property?.state || "",
          zipcode: property?.zipcode || "",
          type: property?.type || "sale",
          property_type: property?.property_type || "",
          bedrooms: property?.bedrooms || 0,
          bathrooms: property?.bathrooms || 0,
          area: property?.area || 0,
          status: property?.status || "draft",
          amenities: property?.amenities ?? []
        };

        setFormData(normalizedProperty);
        setImages(property?.image_urls ?? []);

        setAmenities(attrRes.data.amenities || []);
        setPropertyTypes(attrRes.data.property_types || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Validation (same as AddProperty)
  const validatePropertyForm = (data: any) => {
    const newErrors: Record<string, string> = {};

    if (!data.title?.trim()) newErrors.title = "Title is required.";
    else if (data.title.length > 150)
      newErrors.title = "Title should not exceed 150 characters.";

    if (!data.description?.trim() || data.description.length < 20)
      newErrors.description = "Description must be at least 20 characters.";

    if (!data.price || isNaN(Number(data.price)) || data.price < 0)
      newErrors.price = "Valid price is required.";
    else if (data.price > 999999999)
      newErrors.price = "Amount should not be greater than 999999999.";

    if (!data.location?.trim()) newErrors.location = "Location is required.";
    if (!data.address?.trim()) newErrors.address = "Address is required.";
    if (!data.city?.trim()) newErrors.city = "City is required.";
    if (!data.state?.trim()) newErrors.state = "State is required.";
    if (!data.zipcode?.trim()) newErrors.zipcode = "Zip code is required.";
    if (!["sale", "rent"].includes(data.type))
      newErrors.type = "Type must be Sale or Rent.";
    if (!data.property_type?.trim())
      newErrors.property_type = "Property type is required.";

    if (data.bedrooms < 0 || isNaN(Number(data.bedrooms)))
      newErrors.bedrooms = "Valid bedrooms count is required.";
    else if (data.bedrooms > 20)
      newErrors.bedrooms = "Bedrooms cannot exceed 20.";
    if (data.bathrooms < 0 || isNaN(Number(data.bathrooms)))
      newErrors.bathrooms = "Valid bathrooms count is required.";
    else if (data.bathrooms > 20)
      newErrors.bathrooms = "Bathrooms cannot exceed 20.";
    if (data.area <= 0 || isNaN(Number(data.area)))
      newErrors.area = "Valid area is required.";
    else if (data.area > 100000)
      newErrors.area = "Area cannot exceed 100000.";

    // ✅ Image validation
    const maxSize = 5 * 1024 * 1024;
    newImages.forEach((file) => {
      if (file.size > maxSize) {
        newErrors.images = `"${file.name}" exceeds the 5MB size limit.`;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please correct marked fields");
      return false;
    }
    return true;
  };

  // Handle field change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev: any) => {
      const updated = checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((a: string) => a !== value);
      return { ...prev, amenities: updated };
    });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles = validateImage(e, 5);
    if(!validFiles) return;

    setNewImages((prev) => [...prev, ...validFiles]);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    // size limit: 50MB
    if (file.size > 50 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        video: "Video exceeds 50MB size limit.",
      }));
      return;
    }

    // format validation
    if (file.type !== "video/mp4") {
      setErrors((prev) => ({
        ...prev,
        video: "Only MP4 video format is allowed.",
      }));
      return;
    }

    // valid → clear errors
    setErrors((prev) => ({ ...prev, video: "" }));
    setVideo(file);
  };

  const handleRemoveExistingImage = (index: number) => {
    setRemoveImages((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return "https://placehold.co/400x300?text=No+Image";
    if (path.startsWith("http")) return path;
    const clean = path.replace(/^public\//, "").replace(/^storage\//, "");
    return `${import.meta.env.VITE_BACKEND_URL}/storage/${clean}`;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    // 🧩 Validate before submit
    const isValid = validatePropertyForm(formData);
    if (!isValid) return;

    setSaving(true);
    try {
      const data = new FormData();

      // ✅ Append all fields safely
      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (Array.isArray(value)) {
          value.forEach((v) => data.append(`${key}[]`, v));
        } else {
          data.append(key, String(value));
        }
      });

      // ✅ Handle image arrays
      removeImages.forEach((i) => data.append("remove_images[]", i.toString()));
      newImages.forEach((file) => data.append("images[]", file));

      if(video){
        data.append("video", video);
        data.append("remove_video", "1");
      }

      // ✅ Submit to backend
      await updateProperty(Number(id), data);

      toast.success("Property updated successfully!");
      navigate("/agent/properties");
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Something went wrong!';
      toast.error("Failed to update property: " + message);
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

  return (
    <AdminLayout>
      <div className="bg-white p-8 rounded-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          🏠 Edit Property
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Property Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md border-gray-300"
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.property_type && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.property_type}
                  </p>
                )}
              </div>

              <InputField
                label="Price ($)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
              />
              <InputField
                label="Area (sqft)"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                error={errors.area}
              />
              <InputField
                label="Bedrooms"
                name="bedrooms"
                type="text"
                value={formData.bedrooms}
                onChange={handleChange}
                error={errors.bedrooms}
                maxLength={2}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    const allowedKeys = ["Enter", "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
              />
              <InputField
                label="Bathrooms"
                name="bathrooms"
                type="text"
                value={formData.bathrooms}
                onChange={handleChange}
                error={errors.bathrooms}
                maxLength={2}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    const allowedKeys = ["Enter", "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-md p-3 border-gray-300"
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Amenities</h3>
            <div className="grid grid-cols-2 lg:grid-cols-9 gap-3 bg-gray-100 p-4 rounded-lg">
              {amenities.map((item) => (
                <label
                  key={item.key}
                  className="flex items-center text-sm gap-2"
                >
                  <input
                    type="checkbox"
                    value={item.key}
                    checked={formData.amenities.includes(item.key)}
                    onChange={handleAmenityChange}
                    className="accent-blue-600 rounded cursor-pointer"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* Existing + New Images */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Existing Images
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images?.length ? (
                images.map((img: string, i: number) => (
                  <div key={i} className="relative">
                    <img
                      src={getImageUrl(img)}
                      className={`w-full h-40 object-cover rounded-lg border ${
                        removeImages.includes(i)
                          ? "opacity-40 border-red-400"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(i)}
                      className="absolute top-2 right-2 bg-white border rounded-full px-2 py-1 text-xs shadow"
                    >
                      {removeImages.includes(i) ? "Undo" : "Remove"}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No existing images.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add New Images</h3>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
            {newImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
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
                      className="absolute top-2 right-2 bg-white border rounded-full text-xs px-2 py-1 shadow"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 mt-4">Add Property Video</h3>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Upload Video (MP4 only, max 1 file)
              </label>
              <Input
                type="file"
                name="video"
                className={`border-gray-300 ${
                  errors.video ? "border-red-500" : ""
                }`}
                accept="video/mp4"
                onChange={handleVideoChange}
              />
              {errors.video && (
                <p className="text-red-500 text-xs mt-1">{errors.video}</p>
              )}
            </div>

          {/* ---------- Location Section ---------- */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Address
                </label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`border-gray-300 ${errors.address ? "border-red-500" : ""}`}
                  maxLength={200}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Location
                </label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`border-gray-300 ${errors.location ? "border-red-500" : ""}`}
                  maxLength={200}
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  City
                </label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`border-gray-300 ${errors.city ? "border-red-500" : ""}`}
                  maxLength={50}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  State
                </label>
                <Input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`border-gray-300 ${errors.state ? "border-red-500" : ""}`}
                  maxLength={50}
                />
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Zipcode
                </label>
                <Input
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  className={`border-gray-300 ${errors.zipcode ? "border-red-500" : ""}`}
                  maxLength={10}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    const allowedKeys = ["Enter", "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.zipcode && (
                  <p className="text-red-500 text-xs mt-1">{errors.zipcode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Status + Type */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { label: "Draft", value: "draft" },
                  { label: "Published", value: "published" },
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

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              {saving ? "Updating..." : "Update Property"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

// ✅ Reusable InputField with inline error
const InputField = ({ label, name, value, onChange, type = "text", error, maxLength, onKeyPress }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
    </label>
    <Input
      name={name}
      type={type}
      value={value || ""}
      onChange={onChange}
      maxLength={maxLength || undefined}
      className={`border-gray-300 ${error ? "border-red-400" : ""}`}
      onKeyPress={onKeyPress || undefined}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full border p-2 rounded-md border-gray-300"
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
