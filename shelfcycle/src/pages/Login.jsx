import { useContext, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import SummaryAPI from "../common";
import { toast } from "react-toastify";
import Context from "../context";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { fetchUserDetails } = useContext(Context);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(SummaryAPI.login.url, {
        method: SummaryAPI.login.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        fetchUserDetails();
        navigate("/");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch(SummaryAPI.googleLogin.url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
  
      const data = await res.json();
  
      if (data.requiresVerification) {
        toast.info(data.message || "OTP sent. Please verify.");
        navigate("/verify-email", {
          state: { email: data.data.email }, // 👈 pass email
        });
      } else if (data.success) {
        toast.success("Google login successful");
        fetchUserDetails();
        navigate("/");
      } else {
        toast.error(data.message || "Google login failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Google login error:", err);
    }
  };

  return (
    <section id="login">
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 mt-[-100px]">
          <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>
          <p className="text-gray-600 text-center mb-6">
            Sign in to your ShelfCycle account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 grid">
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

            <div className="mb-4 relative">
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="*********"
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

            <Link
              to={"/forgot-password"}
              className="block w-fit ml-auto hover:underline text-blue-500 pb-3 hover:text-blue-700"
            >
              Forgot password?
            </Link>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Sign in
            </button>
          </form>

          <div className="my-4 text-center text-gray-500">— or —</div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error("Google Login Failed")}
            />
          </div>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?
            <Link
              to="/signup"
              className="text-blue-500 hover:underline hover:text-blue-700 ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
