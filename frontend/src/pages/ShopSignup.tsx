import { useState } from "react";
import { Link } from "react-router-dom";
import React from "react";

const ShopOwnerSignup = () => {
  const [formData, setFormData] = useState({
    shopname: "",
    fullname: { firstname: "", lastname: "" },
    email: "",
    password: "",
    shop: {
      shop_address: "",
      gstNumber: "",
      licenseNumber: "",
      services: [],
      location: { lat: "", lng: "" },
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        const updatedForm = { ...prev };
        let current = updatedForm;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return updatedForm;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Shop Owner Data:", formData);
  };

  return (
    <div className="p-8 max-w-md mx-auto border rounded-lg shadow-2xl bg-white">
      <h2 className="text-3xl font-extrabold text-center text-green-600 mb-6">
        Shop Owner Signup
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="shopname"
          placeholder="Shop Name"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fullname.firstname"
          placeholder="First Name"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fullname.lastname"
          placeholder="Last Name"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="shop.shop_address"
          placeholder="Shop Address"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="shop.gstNumber"
          placeholder="GST Number"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="shop.licenseNumber"
          placeholder="License Number"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded-lg font-bold transition duration-200"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center">
        Not a Shop Owner?{" "}
        <Link to="/user-signup" className="text-green-500 underline">
          Sign up as a User
        </Link>
      </p>
      <p className="mt-4 text-center">
        Already a Shop Owner?{" "}
        <Link to="/shop-login" className="text-green-500 underline">
          Login Here
        </Link>
      </p>
    </div>
  );
};

export default ShopOwnerSignup;