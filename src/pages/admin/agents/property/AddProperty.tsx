/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createProperty } from "@/api/agent/property";
import { toast } from "sonner";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    status: "draft",
    amenities: "",
  });

  const [images, setImages] = useState<FileList | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // prepare form data for multipart request
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "amenities") {
          // split amenities by comma if string
          const amenityList = typeof value === 'string'
            ? value.split(",").map((a) => a.trim())
            : [];
          amenityList.forEach((a) => data.append("amenities[]", a));
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
      toast.success("✅ Property created successfully!");
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
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Title
                </label>
                <Input
                  name="title"
                  className="border-gray-300"
                  placeholder="Beautiful Family House"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Property Type
                </label>
                <Input
                  name="property_type"
                  className="border-gray-300"
                  placeholder="e.g. Apartment, Villa, Condo"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Price ($)
                </label>
                <Input
                  name="price"
                  className="border-gray-300"
                  type="number"
                  placeholder="150000"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Area (sqft)
                </label>
                <Input
                  name="area"
                  className="border-gray-300"
                  type="number"
                  placeholder="1200"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Bedrooms
                </label>
                <Input
                  name="bedrooms"
                  className="border-gray-300"
                  type="number"
                  placeholder="3"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Bathrooms
                </label>
                <Input
                  name="bathrooms"
                  className="border-gray-300"
                  type="number"
                  placeholder="2"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe the property..."
                className="w-full border rounded-md p-3 h-28 border-gray-300"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Amenities (comma separated)
              </label>
              <Input
                name="amenities"
                className="border-gray-300"
                placeholder="e.g. Gym, Swimming Pool, Garden"
                onChange={handleChange}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Upload Images (max 10)
              </label>
              <Input
                type="file"
                name="images"
                className="border-gray-300"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* ---------- Location Section ---------- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Address
                </label>
                <Input
                  name="address"
                  placeholder="123 Main St"
                  className="border-gray-300"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Location
                </label>
                <Input
                  name="location"
                  placeholder="Downtown"
                  className="border-gray-300"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  City
                </label>
                <Input
                  name="city"
                  placeholder="New York"
                  className="border-gray-300"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  State
                </label>
                <Input
                  name="state"
                  placeholder="NY"
                  className="border-gray-300"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">
                  Zip Code
                </label>
                <Input
                  name="zipcode"
                  placeholder="10001"
                  className="border-gray-300"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* ---------- Status Section ---------- */}
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Status
              </label>
              <select
                name="status"
                className="w-full border p-2 rounded-md border-gray-300 cursor-pointer"
                onChange={handleChange}
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
                className="w-full border p-2 rounded-md border-gray-300 cursor-pointer"
                onChange={handleChange}
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
          </div>

          {/* ---------- Submit Button ---------- */}
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
