import React, { useState } from 'react';
import { useShop } from '../../context/shopdataContext';
import { useUser } from '../../context/userContext';
import axios from 'axios';

const PlaceOrder = () => {

  const { user } = useUser();
  const [number, setNumber] = useState<string>('');
  const { selectedShop } = useShop();
  const [orderDetails, setOrderDetails] = useState({
    medicineName: selectedShop.medicine_name, // Updated to use selectedShop.medicine_name
    quantity: 1,
    address: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setOrderDetails({
            ...orderDetails,
            address: `Latitude: ${latitude}, Longitude: ${longitude}`,
          });
        },
        (error) => {
          console.error('Error fetching location:', error);
          alert('Unable to fetch location. Please enter your address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order placed:', orderDetails);

    const response = axios.post(`${import.meta.env.VITE_BASE_URL}/users/PlaceOrder`, {
      user:user?.email,
      storeemail: selectedShop.email,
      medicineName: orderDetails.medicineName,
      quantity: orderDetails.quantity,
      address: orderDetails.address,
      number: number,

    });
    response
      .then((res) => {
        console.log('Order placed successfully:', res.data);
        setOrderPlaced(true);
      })
      .catch((error) => {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again later.');
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary-600 text-white py-4 shadow-md">
        <h1 className="text-center text-2xl font-bold">Place Your Order</h1>
      </header>
      <div className="flex items-center justify-center py-10">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          {orderPlaced ? (
            <div className="text-center">
              <h2 className="text-xl font-bold text-green-600 mb-4">Order Placed Successfully!</h2>
              <p className="text-gray-700">Thank you for your order. We will process it shortly.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700">
                    Medicine Name
                  </label>
                  <span className="mt-1 block w-full border-gray-300 h-7 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >{selectedShop.medicine_name}</span>
                </div>
                <div className="mb-4">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={orderDetails.quantity}
                    onChange={handleInputChange}
                    className="mt-1 block w-full h-7 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    min="1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input placeholder='Enter your phone number' id="number"
                    name="number"
                    type="number"
                    autoComplete="number"
                    required
                    value={number}
                    onChange={(e) => setNumber(e.target.value)} className="mt-1 block w-full border-gray-300 h-7 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  > </input>
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={orderDetails.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    rows={3}
                    required
                  ></textarea>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="mt-2 text-primary-600 hover:underline text-sm"
                  >
                    Use Current Location
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Place Order
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
