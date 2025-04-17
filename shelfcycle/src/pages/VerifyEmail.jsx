import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryAPI from "../common";
import { motion } from "framer-motion";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId;
  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(SummaryAPI.verifyEmailOTP.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp,
          ...(userId && { userId }),
          ...(email && { email }),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-md shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Verify Your Email</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
          We’ve sent a 6-digit OTP to <br />
          <span className="font-medium text-blue-600 dark:text-blue-400">{email}</span>
        </p>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition"
          >
            Verify
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
