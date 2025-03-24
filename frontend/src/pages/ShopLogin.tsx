import { useState } from "react";
import { Link } from "react-router-dom";
import React from "react";

const ShopOwnerLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Shop Owner Login Data:", formData);
  };

  return (
    <div className="p-8 max-w-md mx-auto border rounded-lg shadow-2xl bg-white">
      <h2 className="text-3xl font-extrabold text-center text-green-600 mb-6">
        Shop Owner Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded-lg font-bold transition duration-200"
        >
          Log In
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link to="/shop-signup" className="text-green-500 underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default ShopOwnerLogin;