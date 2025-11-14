import { Attributes, getProperty, InquiryFormData, propertyAttributes, propertyInquiry } from '@/api/customer/properties';
import Loader from '@/components/ui/Loader';
import { DocumentFile, Property } from '@/types/property';
import { CircleDot, Eye, File, FileImage, FileSpreadsheet, FileText, FileType } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CustomerInquiryModal from './CustomerInquiryModal';
import { toast } from 'sonner';
import { formatAmount, getDocumentTypeFromUrl, getFileSizeInMB } from '@/helpers/customer_helper';
import ImageModal from './ImageModal';

const PropertyView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [property, setProperty] = useState<Property | null>(null);
  const [amenities, setAmenities] = useState<Attributes[]>();
  const [propertyTypes, setPropertyTypes] = useState<Attributes[]>();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const isLogin = localStorage.getItem("token") ? true : false;

  const fetchPropertyAttributes = async () => {
    const response = await propertyAttributes();
    setAmenities(response.data.amenities);
    setPropertyTypes(response.data.property_types);
  };

  const handleSubmitInquiry = async (inquiryData: InquiryFormData) => {
    const response = await propertyInquiry(Number(id), inquiryData);

    if(response.success){
        toast.success(response.message);
    }else{
        toast.success(response.message);
    }
    
    // Handle the form submission (API call, etc.)
    setIsModalOpen(false);
  };

  const getDocumentIcon = (
    type: "pdf" | "image" | "word" | "excel" | "other"
  ): JSX.Element => {
    switch (type) {
      case "pdf":
        return <FileText className="text-red-500 mr-2" />;
      case "image":
        return <FileImage className="text-green-500 mr-2" />;
      case "word":
        return <FileType className="text-blue-600 mr-2" />; // closest Lucide icon for Word
      case "excel":
        return <FileSpreadsheet className="text-green-600 mr-2" />;
      default:
        return <File className="text-gray-500 mr-2" />;
    }
  };

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageIndex(null);
  };

  useEffect(() => {
    const fetchProperty = async () => {
        try {
            const data = await getProperty(Number(id));
            if(data.success){              
                initDocuments(data.data.property?.document_urls);
                setProperty(data.data.property);
                setImages(data.data.property.image_urls);
                setDocuments(data.data.property.document_urls);
            }else{
                console.error("Error fetching property:" + data.message);
            }
        } catch {
            console.error("Failed to load property details");
        } finally {
            setLoading(false);
        }
    };

    fetchPropertyAttributes();
    fetchProperty();
  }, [id]);

  const initDocuments = (documents: DocumentFile[] = []): void => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const imageDocs = documents.filter((doc) =>
      imageExtensions.some((ext) => doc.url.toLowerCase().endsWith(ext))
    );

    const nonImageDocs = documents.filter(
      (doc) =>
        !imageExtensions.some((ext) => doc.url.toLowerCase().endsWith(ext))
    );

    setImages(imageDocs.map((doc) => doc.url));
    setDocuments(nonImageDocs);
  };

  if(loading){
      return (
          <Loader />
      )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">

        {/* Property Images Gallery */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          {images.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 p-2">
            {/* Main Image */}
            <div className="lg:col-span-2 lg:row-span-2">
              <img 
                src={images[0] ?? " "} 
                alt="Property main image" 
                className="w-full h-80 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/assets/no_image_found.jpg";
                }}
              />
            </div>
            {/* Secondary Images */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-2">
              {images.slice(1, images.length).map((image, index) => (
                <img 
                  key={index}
                  src={image ?? ''} 
                  alt={`Property image ${index + 2}`} 
                  className={`w-full h-40 object-cover rounded-lg cursor-pointer transition-opacity ${
                    selectedImage === image ? 'opacity-100 ring-2 ring-blue-500' : 'opacity-90 hover:opacity-100'
                  }`}
                  onClick={() => handleImageClick(image, index)}
                />
              ))}
            </div>
          </div>
          ) : (
            <img 
                src={'/assets/no_image_found.jpg'} 
                alt="Property main image" 
                className="h-80 object-fill rounded-lg mx-auto"
                onError={(e) => {
                  e.currentTarget.src = "/assets/no_image_found.jpg";
                }}
              />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {property?.title}
                    </h1>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        property?.approval_status === "approved"
                          ? "bg-green-100 text-green-800"
                          : property?.approval_status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {(property?.approval_status?.charAt(0).toUpperCase() ?? "") +
                        (property?.approval_status?.slice(1) ?? "")}
                    </span>
                  </div>
                  <div className="flex items-start sm:items-center text-gray-600 flex-wrap gap-1 mb-4">
                    <span className="text-sm sm:text-base leading-snug">
                      {property?.address}, {property?.city}, {property?.state}{" "}
                      {property?.zipcode}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-left sm:text-right">
                  <p className="text-xl sm:text-2xl font-bold text-blue-500">
                    ${formatAmount(property?.price ?? 0)}
                  </p>
                  <p className="text-gray-600 capitalize text-sm sm:text-base">
                    For {property?.type === "sale" ? "Sale" : "Rent"}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-t border-b border-gray-200 mt-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-500">
                    {property?.bedrooms}
                  </div>
                  <div className="text-gray-600 text-sm">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-500">
                    {property?.bathrooms}
                  </div>
                  <div className="text-gray-600 text-sm">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-500">
                    {property?.area?.toLocaleString()}
                  </div>
                  <div className="text-gray-600 text-sm">Sq Ft</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {property?.description}
              </p>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-semibold capitalize">{propertyTypes?.find(a => a.key === property?.property_type)?.label ?? '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">City:</span>
                    <span className="font-semibold">{property?.city}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">State:</span>
                    <span className="font-semibold">{property?.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zip Code:</span>
                    <span className="font-semibold">{property?.zipcode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              {property?.amenities && property?.amenities?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property?.amenities?.map((amenityKey: string, index: number) => {
                  const amenity = amenities?.find(a => a.key === amenityKey);

                  return (
                    <div key={index} className="flex items-center text-gray-700">
                      <CircleDot size={20} className="mr-2 text-blue-400" />
                      <span className="truncate max-w-[200px]">
                        {amenity ? amenity.label : amenityKey}
                      </span>
                    </div>
                  );
                })}
              </div>
              ) : (
                <div className='text-gray-500 italic'>No amenities found.</div>
              )}
            </div>

            {/* Location & Map */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Address</h3>
                    <p className="text-gray-600">
                      {property?.address}<br />
                      {property?.city}, {property?.state} {property?.zipcode}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Neighborhood</h3>
                    <p className="text-gray-600">{property?.location}</p>
                  </div>
                </div>
                {/* Map Placeholder */}
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.8776891874794!2d72.57136217526489!3d23.022505779165887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f5cf3a65df%3A0x3b1c7c5c50b99b39!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1699536000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ahmedabad Map"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Agent & Actions */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Listing Agent</h2>
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={property?.agent?.avatar_url ?? ' '} 
                  alt="Agent" 
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/user.jpg";
                  }}
                />
                <div>
                  <h3 className="font-bold text-lg">{property?.agent.name}</h3>
                  <p className="text-gray-600">{property?.agent.email}</p>
                </div>
              </div>
              <button onClick={() => {
                if(isLogin){
                  setIsModalOpen(true);
                }else{
                  navigate('/login');
                }
              }} className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold cursor-pointer">
                Contact Agent
              </button>
            </div>

            {/* Property Status */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${
                    property?.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : property?.status === 'inactive'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {(property?.status.charAt(0).toUpperCase() ?? "") + property?.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Approval:</span>
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${
                    property?.approval_status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : property?.approval_status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {(property?.approval_status.charAt(0).toUpperCase() ?? '') + property?.approval_status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Documents</h2>
              <div className="space-y-3">
                {documents.length > 0 ? 
                <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      {getDocumentIcon(getDocumentTypeFromUrl(doc.url))}
                      <div>
                        <p className="font-medium truncate max-w-[220px]">{doc.name}</p>
                        <p className="text-gray-500 text-sm">{getFileSizeInMB(doc.size)}</p>
                      </div>
                    </div>
                    {isLogin ? (
                      <a href={doc.url} target="_blank" download className="text-blue-500 hover:text-blue-700 cursor-pointer">
                        <Eye />
                      </a>
                    ) : (
                      <Link to={'/login'} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                        <Eye />
                      </Link>
                    )}
                  </div>
                ))}
                </div> : (
                  <div className='text-gray-500 italic'>No Documents Found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomerInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitInquiry}
      />

      {/* Image Modal */}
      <ImageModal
        images={images ?? []}
        initialIndex={selectedImageIndex || 0}
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
        title={"Property Image"}
      />
    </div>
  );
};

export default PropertyView;