import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    fullname: { firstname: "", lastname: "" },
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [key, subKey] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [key]: { ...prev[key], [subKey]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", formData);
  };

  return (
    <div className="p-8 max-w-md mx-auto border rounded-lg shadow-2xl bg-white">
      <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6">
        User Signup
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullname.firstname"
          placeholder="First Name"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fullname.lastname"
          placeholder="Last Name"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white w-full py-3 rounded-lg font-bold transition duration-200"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center">
        Not a User?{" "}
        <Link to="/shop-signup" className="text-blue-600 underline">
          Sign up as a Shop Owner
        </Link>
      </p>
      <p className="mt-2 text-center">
        Already a User?{" "}
        <Link to="/user-login" className="text-blue-600 underline">
          Login as a User
        </Link>
      </p>
    </div>
  );
};

export default UserSignup;