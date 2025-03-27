import React from 'react';
import { Package, Truck, CheckCircle } from 'lucide-react';

const OrderTracking = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Track Your Order</h1>
        
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order #12345
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Placed on March 15, 2024
              </p>
            </div>
            
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-8">
                  <div className="relative flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                      <Package className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Order Confirmed</h4>
                      <p className="text-sm text-gray-500">10:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                      <Truck className="h-6 w-6  text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Out for Delivery</h4>
                      <p className="text-sm text-gray-500">11:45 AM</p>
                    </div>
                  </div>
                  
                  <div className="relative flex items-center opacity-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <CheckCircle className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-400">Delivered</h4>
                      <p className="text-sm text-gray-400">Estimated by 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Order Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Address</span>
                  <span className="text-gray-900">123 Main St, Apt 4B, City</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact Number</span>
                  <span className="text-gray-900">+91 98765 43210</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="text-gray-900">Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;