import React from 'react';
import {
  AlertTriangle,
  Package,
  ThermometerSun,
  Pill,
  ShieldAlert,
  Share2,
  Clock,
  Store,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/shopdataContext';

const MedicineDetails = () => {
  const { selectedShop } = useShop();
  console.log("Selected Shop:", selectedShop);
  if (!selectedShop.shopName) {
    return <div>No shop information available</div>;
  }

  const medicineDetails = {
    id: "para123",
    name: "Paracetamol",
    manufacturer: "Generic Manufacturer",
    description: "Paracetamol is a widely used over-the-counter medication known for its analgesic (pain-relieving) and antipyretic (fever-reducing) properties.",
    imageUrl: "/medicine-placeholder.jpg",
    price: 15.50,
    discount: 10,
    mrp: 17.22,
    contains: "Paracetamol 500mg",
    therapy: "Analgesic, Antipyretic",
    uses: ["Relief of mild to moderate pain such as headache, muscle ache, toothache", "Reduction of fever"],
    sideEffects: ["Rarely, allergic reactions may occur"],
    contraindications: ["Hypersensitivity to paracetamol", "Severe liver disease"],
    storageInstructions: ["Store below 30°C in a dry place."],
    directions: ["Take 1-2 tablets every 4-6 hours as needed. Do not exceed 4000mg (8 tablets of 500mg) in 24 hours."],
    warnings: ["Consult a doctor if symptoms persist for more than a few days.", "Use with caution in patients with liver or kidney problems."],
    packaging: "Strip of 10 tablets",
    deliveryInfo: "Usually delivers in 1-2 days"
  };

  const PriceDisplay = () => (
    <div className="flex items-baseline gap-3 mb-2">
      <span className="text-3xl font-bold">₹{medicineDetails.price}*</span>
      <span className="text-gray-500 line-through">MRP ₹{medicineDetails.mrp}</span>
      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
        {medicineDetails.discount}% OFF
      </span>
    </div>
  );

  const InfoSection = ({ title, icon, items = [] }) => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );

  const WarningSection = () => (
    <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-red-700 mb-2">Important Warnings</h3>
          <ul className="list-disc list-inside text-red-600 space-y-2">
            {(medicineDetails.warnings || []).map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{selectedShop.shopName}</h1>
          <p className="text-gray-600">Address: {selectedShop.shopAddress}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative flex items-center justify-center">
                  {/* <img 
                    src={medicineDetails.imageUrl} 
                    alt={`${medicineDetails.name} Medicine`}
                    className="w-80 aspect-square object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/medicine-placeholder.jpg';
                    }}
                  /> */}
                  <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {medicineDetails.name} - {medicineDetails.packaging}
                  </h2>
                  <p className="text-gray-600 mb-4">By {medicineDetails.manufacturer}</p>
                  <p className="text-lg font-medium mb-4">{medicineDetails.packaging}</p>

                  <PriceDisplay />

                  <p className="text-sm text-gray-500 mb-6">*Inclusive of all taxes</p>
                  <div className='grid grid-cols-2 gap-4 mb-4'>
                    <Link to='/map' className="w-full bg-teal-600 text-white py-4 rounded-lg hover:bg-teal-700 transition font-medium text-lg flex items-center justify-center">
                      Pick up now
                    </Link>
                    <button className="w-full bg-teal-600 text-white py-4 rounded-lg hover:bg-teal-700 transition font-medium text-lg">
                      Add To Cart
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <p>Delivery by <span className="font-medium">{medicineDetails.deliveryInfo}</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-start gap-4">
                <Package className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Product Description</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {medicineDetails.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <ThermometerSun className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Key Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded p-4">
                  <p className="font-medium text-gray-700">Contains</p>
                  <p className="text-gray-600">{medicineDetails.contains}</p>
                </div>
                <div className="border rounded p-4">
                  <p className="font-medium text-gray-700">Therapy</p>
                  <p className="text-gray-600">{medicineDetails.therapy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoSection
            title="Uses"
            icon={<Pill className="w-5 h-5 text-blue-600" />}
            items={medicineDetails.uses}
          />

          <InfoSection
            title="Contraindications"
            icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
            items={medicineDetails.contraindications}
          />

          <InfoSection
            title="Storage Instructions"
            icon={<ShieldAlert className="w-5 h-5 text-yellow-600" />}
            items={medicineDetails.storageInstructions}
          />

          <InfoSection
            title="Directions for Use"
            icon={<Clock className="w-5 h-5 text-blue-600" />}
            items={medicineDetails.directions}
          />
        </div>

        {medicineDetails.warnings && medicineDetails.warnings.length > 0 && <WarningSection />}

        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold">Shop Location</h2>
          <p><strong>Latitude:</strong> {selectedShop.latitude}</p>
          <p><strong>Longitude:</strong> {selectedShop.longitude}</p>
        </div>
      </main>
    </div>
  );
};

export default MedicineDetails;