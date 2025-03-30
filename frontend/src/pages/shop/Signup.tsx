import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCaptain } from '../../context/CaptainContext';

const ShopSignup = () => {
  const navigate = useNavigate();
  const { setCaptain } = useCaptain();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [licencenumber, setLicencenumber] = useState<string>('');
  const [gstnumber, setGstnumber] = useState<string>('');
  const [shopname, setShopname] = useState<string>('');
  const [shop_address, setShopaddress] = useState<string>('');
  const [phonenumber, setPhonenumber] = useState<string>('');
  const [services, setServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Fetch user's location when the page loads
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Location Error:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (!shopname || !email || !password || !firstName || !phonenumber || !gstnumber || !licencenumber) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(phonenumber)) {
      setError('Phone number must be exactly 10 digits');
      setIsLoading(false);
      return;
    }

    // Validate GST number format
    if (!/^[0-9A-Z]{15}$/.test(gstnumber)) {
      setError('GST Number must be exactly 15 characters');
      setIsLoading(false);
      return;
    }

    // Validate license number
    if (isNaN(Number(licencenumber)) || Number(licencenumber) < 1) {
      setError('Please enter a valid license number');
      setIsLoading(false);
      return;
    }

    // Validate coordinates
    if (latitude === null || longitude === null) {
      setError('Location access is required');
      setIsLoading(false);
      return;
    }

    // Validate shop address
    if (!shop_address.trim()) {
      setError('Shop address is required');
      setIsLoading(false);
      return;
    }

    // Validate minimum address length
    

    const captainData = {
      shopname: shopname.trim(),
      fullname: {
        firstname: firstName.trim(),
        lastname: lastName.trim()
      },
      email: email.trim().toLowerCase(),
      password,
      phoneNumber: phonenumber,
      shop: {
        gstNumber: gstnumber.toUpperCase(),
        licenseNumber: Number(licencenumber),
        shop_address: shop_address.trim(),
        location: {
          type: 'Point',
          coordinates: [Number(longitude), Number(latitude)] // Ensure numbers
        },
        services: services
      }
    };

    try {
      console.log('Sending data:', captainData);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        console.log('Registration successful:', response.data);
        setError('');
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('captain', JSON.stringify(data.captain));
        localStorage.setItem('token', data.token);
        navigate('/shop/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg || 
                          'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceChange = (service: string) => {
    setServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Store className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register your pharmacy
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already registered?{' '}
          <Link to="/shop/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form  
          onSubmit={submitHandler}
          className="space-y-6">
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
                Shop name
              </label>
              <div className="mt-1">
                <input
                  id="shopName"
                  name="shopName"
                  type="text"
                  required
                  value={shopname}
                  onChange={(e) => setShopname(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phonenumber"
                  name="phonenumber"
                  type="tel"
                  pattern="[0-9]{10}"
                  autoComplete="tel"
                  required
                  value={phonenumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhonenumber(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter 10-digit number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

             <input type="hidden" name="latitude" value={latitude || ''} />
             <input type="hidden" name="longitude" value={longitude || ''} />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
                  GST number
                </label>
                <div className="mt-1">
                  <input
                    id="gstNumber"
                    name="gstNumber"
                    type="text"
                    required
                    value={gstnumber}
                    onChange={(e) => setGstnumber(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                  License number
                </label>
                <div className="mt-1">
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    required
                    value={licencenumber}
                    onChange={(e) => setLicencenumber(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="shopAddress" className="block text-sm font-medium text-gray-700">
                Shop Address
              </label>
              <div className="mt-1">
                <textarea
                  id="shopAddress"
                  name="shopAddress"
                  rows={3}
                  required
                  value={shop_address}
                  onChange={(e) => setShopaddress(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter complete shop address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Available services</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="homeDelivery"
                    name="services"
                    type="checkbox"
                    checked={services.includes('Home Delivery')}
                    onChange={() => handleServiceChange('Home Delivery')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="homeDelivery" className="ml-2 block text-sm text-gray-900">
                    Home Delivery
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="onlineOrders"
                    name="services"
                    type="checkbox"
                    checked={services.includes('Online Orders')}
                    onChange={() => handleServiceChange('Online Orders')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="onlineOrders" className="ml-2 block text-sm text-gray-900">
                    Online Orders
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  'Register'
                )}
              </button>
            </div>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
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
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopSignup;