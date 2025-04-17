import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryAPI from "../common";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(SummaryAPI.resetPassword(token), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Password reset successful");
        navigate("/login");
      } else {
        toast.error(data.message || "Reset failed");
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 px-3 py-2 rounded mb-3 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
