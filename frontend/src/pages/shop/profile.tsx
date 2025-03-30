import React, { useState, useEffect } from 'react';
import { Store, Mail, Phone, MapPin, FileText, CheckCircle, Loader } from 'lucide-react';
import { useCaptain } from '../../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ShopProfile = () => {
  const { captain, setCaptain } = useCaptain();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true); // Set loading state before fetching
    const fetchCaptainProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/shop/login');
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captains/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setCaptain(response.data.captain);
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        setError(error.response?.data?.message || 'Failed to load profile');
        if (error.response?.status === 401) {
          navigate('/shop/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaptainProfile();
  }, [navigate, setCaptain]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!captain || !captain.shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Store className="h-12 w-12 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {captain.shopname}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Shop Profile Details
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              {/* Owner Name */}
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Owner Name</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {`${captain.fullname.firstname} ${captain.fullname.lastname}`}
                </dd>
              </div>

              {/* Email */}
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-400" />
                  Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{captain.email}</dd>
              </div>

              {/* Phone Number */}
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-gray-400" />
                  Phone Number
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{captain.phoneNumber}</dd>
              </div>

              {/* GST Number */}
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gray-400" />
                  GST Number
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{captain.shop.gstNumber}</dd>
              </div>

              {/* License Number */}
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gray-400" />
                  License Number
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {captain.shop?.licenceNumber ? String(captain.shop.licenceNumber) : 'Not available'}
                </dd>
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                  Shop Location
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {`${captain.shop.shop_address}`}
                </dd>
              </div>

              {/* Services */}
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Available Services</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="space-y-2">
                    {captain.shop.services.map((service, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Actions Section */}
        <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
          <button 
            onClick={() => navigate('/shop/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go to Dashboard
          </button>
          <button 
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;