import React, { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Link } from "react-router-dom";
import imgToBase64 from "../helpers/imgToBase64";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [data, setData] = useState({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
      uploadPic: ""
    });
  
    const handleChange = (e) => {
      const {name, value} = e.target
      setData((prev)=> {
          return{
              ...prev, 
              [name] : value
          }
      })
    };

    const handleUploadPicture = async (e) => {
      const file = e.target.files[0]
      const imagePicture = await imgToBase64(file)
      
      setData((prev)=> {
        return{
          ...prev,
          uploadPic : imagePicture
        }
        })

    }
  
    const handleSubmit = (e) => {
      e.preventDefault();
    }
  
    console.log("Login", data)

  return (
    <section id="signup">
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center">Welcome to ShelfCycle</h2>
        <p className="text-gray-600 text-center mb-6">
          Create your ShelfCycle account
        </p>
        <form onSubmit={handleSubmit}>


        {/* Username input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            name="name"
            value={data.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>


        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            name="email"
            value={data.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>


          {/* Phone Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Phone</label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            name="password"
            value={data.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
          />
          <span 
            className="absolute right-3 top-10 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoMdEyeOff size={22} /> : <IoMdEye size={22} />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 font-medium">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
          />
          <span 
            className="absolute right-3 top-10 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <IoMdEyeOff size={22} /> : <IoMdEye size={22} />}
          </span>
        </div>
        

        {/* Upload photo */}
        
          <label>
            <div className="pb-2 block text-gray-700 font-medium">
              Upload Photo
            </div>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleUploadPicture}
            />
          </label>
        



        {/* Sign In Button */}
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition mt-4">
          Sign Up
        </button>

        {/* Signup Link */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account? 
          <Link to="/login" className="text-blue-500 hover:underline hover:text-blue-700">
            Sign in
          </Link>
        </p>
        </form>
      </div>
    </div>
    </section>
  )
}

export default SignUp