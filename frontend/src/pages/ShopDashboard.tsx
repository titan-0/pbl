import React, { useState } from "react";
import {
  Package,
  ShoppingBag,
  DollarSign,
  Users,
  AlertCircle,
} from "lucide-react";

const ShopDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [shopStatus, setShopStatus] = useState(true);

  const orders = [
    {
      id: "ORD001",
      customer: "John Doe",
      items: ["Paracetamol 500mg (2)", "Vitamin C 1000mg (1)"],
      total: 24.97,
      status: "pending",
      time: "10 minutes ago",
    },
    {
      id: "ORD002",
      customer: "Jane Smith",
      items: ["Aspirin 300mg (1)"],
      total: 4.99,
      status: "processing",
      time: "25 minutes ago",
    },
  ];

  const inventory = [
    {
      id: "MED001",
      name: "Paracetamol 500mg",
      stock: 150,
      price: 5.99,
      category: "Pain Relief",
    },
    {
      id: "MED002",
      name: "Vitamin C 1000mg",
      stock: 85,
      price: 12.99,
      category: "Vitamins",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Shop Dashboard</h1>
        <div className="flex items-center">
          <span className="mr-3">Shop Status:</span>
          <button
            onClick={() => setShopStatus(!shopStatus)}
            className={`px-4 py-2 rounded-lg font-medium ${
              shopStatus
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {shopStatus ? "Active" : "Inactive"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Package className="h-10 w-10 text-blue-500" />
            <div className="ml-4">
              <p className="text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">125</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <ShoppingBag className="h-10 w-10 text-green-500" />
            <div className="ml-4">
              <p className="text-gray-500">Products</p>
              <p className="text-2xl font-bold">48</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <DollarSign className="h-10 w-10 text-yellow-500" />
            <div className="ml-4">
              <p className="text-gray-500">Revenue</p>
              <p className="text-2xl font-bold">₹15,240</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Users className="h-10 w-10 text-purple-500" />
            <div className="ml-4">
              <p className="text-gray-500">Customers</p>
              <p className="text-2xl font-bold">84</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 ${
                activeTab === "orders"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              Recent Orders
            </button>
            <button
              className={`px-6 py-3 ${
                activeTab === "inventory"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("inventory")}
            >
              Inventory
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "orders" ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <p className="text-gray-600">{order.customer}</p>
                      <ul className="text-sm text-gray-500 mt-1">
                        {order.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.total}</p>
                      <p className="text-sm text-gray-500">{order.time}</p>
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {inventory.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.price}</p>
                      <p className="text-sm text-gray-500">
                        Stock: {item.stock}
                      </p>
                      {item.stock < 100 && (
                        <div className="flex items-center text-yellow-600 mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">Low Stock</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
