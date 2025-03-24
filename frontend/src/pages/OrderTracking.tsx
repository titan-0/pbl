import React from 'react';
import { Package, Truck, CheckCircle } from 'lucide-react';

const OrderTracking = () => {
  const orders = [
    {
      id: "ORD001",
      date: "2024-03-15",
      status: "processing",
      items: [
        { name: "Paracetamol 500mg", quantity: 2, price: 5.99 },
        { name: "Vitamin C 1000mg", quantity: 1, price: 12.99 }
      ],
      total: 24.97,
      pharmacy: "HealthCare Pharmacy"
    },
    {
      id: "ORD002",
      date: "2024-03-14",
      status: "delivered",
      items: [
        { name: "Aspirin 300mg", quantity: 1, price: 4.99 }
      ],
      total: 4.99,
      pharmacy: "MediCare Plus"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Package className="h-6 w-6 text-yellow-500" />;
      case 'shipping':
        return <Truck className="h-6 w-6 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <Package className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Order #{order.id}</h2>
                <p className="text-gray-600">Placed on {order.date}</p>
                <p className="text-gray-600">From {order.pharmacy}</p>
              </div>
              <div className="flex items-center">
                {getStatusIcon(order.status)}
                <span className="ml-2 text-lg capitalize">{order.status}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold mb-2">Order Items</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-800">{item.name}</p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-gray-800">₹{item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-lg font-semibold">₹{order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;