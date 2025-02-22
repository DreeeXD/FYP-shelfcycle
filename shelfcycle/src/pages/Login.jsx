import React, { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import SummaryAPI from "../common";
import { toast } from "react-toastify";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate()

  const handleChange = (e) => {
    const {name, value} = e.target
    setData((prev)=> {
        return{
            ...prev, 
            [name] : value
        }
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataResponse = await fetch(SummaryAPI.login.url, {
      method: SummaryAPI.login.method,
      credentials : 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify(data)
    })
    const dataAPI = await dataResponse.json()

    if(dataAPI.success){
      toast.success(dataAPI.message)
      navigate("/")

    }
    if(dataAPI.error){
      toast.error(dataAPI.message)
    }

  }

  console.log("Login", data)

  return (
    <section id="login">
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 mt-[-100px]">
        <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>
        <p className="text-gray-600 text-center mb-6">
          Sign in to your ShelfCycle account
        </p>
        <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="mb-4 grid">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            name="email"
            value={data.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="*********"
            name="password"
            value={data.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
          />
          <span 
            className="absolute right-3 top-10 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoMdEyeOff size={22} /> : <IoMdEye size={22} />}
          </span>
        </div>
        <Link to={"/forgot-password"} className="block w-fit ml-auto hover:underline text-blue-500 pb-3 hover:text-blue-700">
        Forgot password?</Link>

        {/* Sign In Button */}
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition">
          Sign in
        </button>

        {/* Signup Link */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account? 
          <Link to="/signup" className="text-blue-500 hover:underline hover:text-blue-700">
            Sign up
          </Link>
        </p>
        </form>
      </div>
    </div>
    </section>
  );
};

export default Login;
