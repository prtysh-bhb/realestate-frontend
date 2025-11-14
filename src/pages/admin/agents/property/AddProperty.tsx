/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createProperty } from "@/api/agent/property";
import { toast } from "sonner";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import {
  Attributes,
  propertyAttributes,
  PropertyFormData,
} from "@/api/customer/properties";
import { validateImage } from "@/helpers/image_helper";

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState<Attributes[]>();
  const [propertyTypes, setPropertyTypes] = useState<Attributes[]>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<PropertyFormData>({
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
    area: "",
    status: "draft",
    amenities: [],
  });

  const [images, setImages] = useState<FileList | null>(null);

  const validatePropertyForm = (formData: any): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) newErrors.title = "Title is required.";
    else if (formData.title.length > 100)
      newErrors.title = "Title should not exceed 100 characters.";
    if (!formData.description?.trim() || formData.description.length < 20)
      newErrors.description = "Description must be at least 20 characters.";
    if (!formData.price || isNaN(Number(formData.price)) || formData.price < 0)
      newErrors.price = "Valid price is required.";
    else if (formData.price > 999999999)
      newErrors.price = "Price cannot exceed 999999999.";
    if (!formData.location?.trim()) newErrors.location = "Location is required.";
    if (!formData.address?.trim()) newErrors.address = "Address is required.";
    if (!formData.city?.trim()) newErrors.city = "City is required.";
    if (!formData.state?.trim()) newErrors.state = "State is required.";
    if (!formData.zipcode?.trim()) newErrors.zipcode = "Zipcode is required.";
    if (!["sale", "rent"].includes(formData.type))
      newErrors.type = "Type must be either Sale or Rent.";
    if (!formData.property_type?.trim())
      newErrors.property_type = "Property type is required.";

    if (
      formData.bedrooms === "" ||
      isNaN(Number(formData.bedrooms)) ||
      formData.bedrooms < 0
    )
      newErrors.bedrooms = "Valid number of bedrooms is required.";

    if (
      formData.bathrooms === "" ||
      isNaN(Number(formData.bathrooms)) ||
      formData.bathrooms < 0
    )
      newErrors.bathrooms = "Valid number of bathrooms is required.";

    if (
      formData.area === "" ||
      isNaN(Number(formData.area)) ||
      formData.area < 0
    )
      newErrors.area = "Valid property area is required.";

    // ✅ Image validation
    if (images && images.length > 0) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      for (const file of images) {
        if (file.size > maxSize) {
          newErrors.images = `"${file.name}" exceeds the 5MB size limit.`;
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAmenityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newAmenities = checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((a) => a !== value);
      return { ...prev, amenities: newAmenities };
    });
  };

  useEffect(() => {
    fetchPropertyAttributes();
  }, []);

  const fetchPropertyAttributes = async () => {
    const response = await propertyAttributes();
    setAmenities(response.data.amenities);
    setPropertyTypes(response.data.property_types);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[name];
        return newErr;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = validateImage(e, 5);
    if(!validFiles) return;

    if (validFiles.length > 0) {
      setImages(validFiles as unknown as FileList);
    } else {
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePropertyForm(formData)) return;

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "amenities") {
          const amenityList =
            typeof value === "string" ? value.split(",") : value;
          amenityList.forEach((a: string) => data.append("amenities[]", a));
        } else {
          data.append(key, value as string);
        }
      });

      if (images) {
        Array.from(images).forEach((img) => {
          data.append("images[]", img);
        });
      }

      await createProperty(data);
      toast.success("Property created successfully!");
      navigate("/admin/agents/property/list");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-2xl p-8 mt-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          🏠 Add New Property
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ---------- Property Info Section ---------- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Property Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Title
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Beautiful Family House"
                  className={`border-gray-300 ${
                    errors.title ? "border-red-500" : ""
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Property Type
                </label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  className={`w-full border p-2 rounded-md border-gray-300 cursor-pointer ${
                    errors.property_type ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes?.map((type) => (
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

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Price ($)
                </label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="150000"
                  className={`border-gray-300 ${
                    errors.price ? "border-red-500" : ""
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                )}
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Area (sqft)
                </label>
                <Input
                  name="area"
                  type="number"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="1200"
                  className={`border-gray-300 ${
                    errors.area ? "border-red-500" : ""
                  }`}
                />
                {errors.area && (
                  <p className="text-red-500 text-xs mt-1">{errors.area}</p>
                )}
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Bedrooms
                </label>
                <Input
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="3"
                  className={`border-gray-300 ${
                    errors.bedrooms ? "border-red-500" : ""
                  }`}
                />
                {errors.bedrooms && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.bedrooms}
                  </p>
                )}
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Bathrooms
                </label>
                <Input
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="2"
                  className={`border-gray-300 ${
                    errors.bathrooms ? "border-red-500" : ""
                  }`}
                />
                {errors.bathrooms && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.bathrooms}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the property..."
                className={`w-full border rounded-md p-3 h-28 border-gray-300 ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Amenities */}
            <div className="mt-4 mb-10">
              <h3 className="font-semibold text-gray-800 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 lg:grid-cols-9 gap-3 bg-gray-100 p-4 rounded-lg">
                {amenities?.map((item) => (
                  <div key={item.key} className="flex items-center">
                    <label className="flex items-center text-sm gap-2">
                      <input
                        type="checkbox"
                        value={item.key}
                        checked={formData.amenities.includes(item.key)}
                        onChange={handleAmenityChange}
                        className="accent-blue-600 rounded cursor-pointer"
                      />
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <h3 className="font-semibold text-gray-800 mb-4">Add New Images</h3>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Upload Images (max 10)
              </label>
              <Input
                type="file"
                name="images"
                className={`border-gray-300 ${
                  errors.images ? "border-red-500" : ""
                }`}
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              {errors.images && (
                <p className="text-red-500 text-xs mt-1">{errors.images}</p>
              )}
            </div>
          </div>

          {/* ---------- Location Section ---------- */}
          <h3 className="font-semibold text-gray-800 mb-4">Location Details</h3>
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

          {/* ---------- Status Section ---------- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md border-gray-300 cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full border p-2 rounded-md border-gray-300 cursor-pointer ${
                    errors.type ? "border-red-500" : ""
                  }`}
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                )}
              </div>
            </div>
          </div>

          {/* ---------- Submit ---------- */}
          <div className="flex justify-center md:justify-end pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 cursor-pointer"
            >
              {loading ? "Saving..." : "Create Property"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProperty;
