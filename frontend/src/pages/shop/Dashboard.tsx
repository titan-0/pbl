import React, { act, useEffect, useState } from 'react';
import { Package2, ShoppingCart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
// import axios from 'axios';
import { useCaptain } from '../../context/CaptainContext';
import { io } from 'socket.io-client';

const ShopDashboard = () => {
  const { captain } = useCaptain();
  const [inventoryStats, setInventoryStats] = useState({
    totalTypes: 0,
    lowStockCount: 0,
  });
  const [orders, setOrders] = useState({
    activeOrders: 0,
    completedOrders: 0,
  });
  const [activeOrdersList, setActiveOrdersList] = useState([]);
  const [showActiveOrders, setShowActiveOrders] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:5000', {
      transports: ['websocket'], // Use WebSocket transport
    });
    socket.emit('joinn', {
      email: captain.email,
      userType: 'store',
    });

    socket.on('pending-orders', (data) => {
      console.log('Pending Orders:', data);
      if (data.success) {
        setOrders((prevOrders) => ({
          ...prevOrders,
          activeOrders: data.orders.length,
        }));
        setActiveOrdersList(data.orders);
      }
    });

    return () => {
      socket.off('pending-orders');
      socket.disconnect();
    };
  }, [captain.email]);

  useEffect(() => {
    if (captain?.medicines) {
      const totalTypes = captain.medicines.length;
      const lowStockCount = captain.medicines.filter(medicine => medicine.quantity < 20).length;

      setInventoryStats({ totalTypes, lowStockCount });
    }
  }, [captain]);

  const handleActiveOrdersClick = () => {
    setShowActiveOrders(!showActiveOrders);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              to="/shop/add-medicine"
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Inventory
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <button className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package2 className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Medicine Types</dt>
                    <dd className="text-lg font-medium text-gray-900">{inventoryStats.totalTypes}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </button>

          <button className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Medicines</dt>
                    <dd className="text-lg font-medium text-gray-900">{inventoryStats.lowStockCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </button>

          <button 
          className="bg-white overflow-hidden shadow rounded-lg"
          onClick={handleActiveOrdersClick}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingCart className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active orders</dt>
                    <dd className="text-lg font-medium text-gray-900">{orders.activeOrders}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </button>

          <button className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed Orders</dt>
                    <dd className="text-lg font-medium text-gray-900">{orders.completedOrders}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </button>
        </div>

        {showActiveOrders && (
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Active Orders</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {activeOrdersList.map((order, index) => (
                  <li key={index}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-primary-600 truncate">
                          {order.medicineName} - {order.quantity}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Address: {order.address}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Phone: {order.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((order) => (
                <li key={order}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-primary-600 truncate">
                        Order #{order}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          completed
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Customer Name
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Order Total: ₹500
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;