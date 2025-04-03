import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

interface MedicineDetails {
  name: string;
  category: string;
  price: number;
  quantity: number;
  shop_name: string;
  shop_address: string;
  distance: string;
}

const MedicineDetails = () => {
  const location = useLocation();
  const [medicineDetails, setMedicineDetails] = useState<MedicineDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Extract the query parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const medicineName = queryParams.get('name');

  useEffect(() => {
    if (!medicineName) {
      setError('No medicine name provided');
      return;
    }

    const fetchMedicineDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view medicine details');
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/medicines/details?name=${encodeURIComponent(medicineName)}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setMedicineDetails(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch medicine details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicineDetails();
  }, [medicineName]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!medicineDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No details available for this medicine</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">{medicineDetails.name}</h1>
        <p className="mt-2 text-lg text-gray-500">{medicineDetails.category}</p>

        <div className="mt-6">
          <p className="text-lg font-semibold text-gray-900">Price: ₹{medicineDetails.price}</p>
          <p className="text-lg text-gray-500">Stock: {medicineDetails.quantity}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-900">Available At:</h2>
          <p className="mt-2 text-lg text-gray-500">{medicineDetails.shop_name}</p>
          <p className="text-lg text-gray-500">{medicineDetails.shop_address}</p>
          <p className="text-lg text-gray-500">Distance: {medicineDetails.distance} km</p>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetails;