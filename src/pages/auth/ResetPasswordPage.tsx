/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/api/axios";
import herohouse from "@/assets/hero-house.jpg";
import Logo from "/public/vite.svg";
import { toast } from "sonner"; // ✅ Import Sonner toast
import { InquiryResponse } from "@/api/customer/properties";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post<InquiryResponse>("/reset-password", {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      await toast.promise(Promise.resolve(response), {
        loading: "Resetting your password...",
        success: "Password reset successful 🎉",
        error: "Failed to reset password",
      });

      setMessage(response.data.message || "Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Something went wrong";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${herohouse})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-lg"></div>

      {/* Main Card */}
      <div
        className="relative z-10 flex flex-col lg:flex-row w-[90%] max-w-5xl h-[600px] 
                    rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Left Panel */}
        <div
          className="hidden lg:flex flex-col justify-center items-center text-white
            bg-[url('/assets/login-image.jpg')] bg-center bg-cover bg-full w-[40%] p-10 relative
            before:content-[''] before:absolute before:inset-0 before:bg-black before:opacity-50"
        >
          <h1 className="text-2xl font-semibold text-center z-2">
            Start your journey with us.
          </h1>
          <p className="text-white-400 text-center mt-2 text-sm z-2">
            It brings together your tasks, projects, timelines, files and more.
          </p>

          <div className="mt-10 text-center z-2">
            <Link to="/">
              <img
                src={Logo}
                alt="Site Logo"
                className="mx-auto w-24 h-auto mb-4 z-2"
              />
            </Link>
            <h2 className="text-xl font-medium mb-4 z-2">
              Welcome to RealEstate
            </h2>
          </div>

          <p className="text-xs text-white-500 mt-20 z-2">© 2025 RealEstate.</p>
        </div>

        {/* Right Section – Reset Password Form */}
        <div className="flex flex-col justify-center items-center w-full lg:w-[60%] bg-white px-10 py-12">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-1">
              Reset Password
            </h2>
            <p className="text-center text-sm text-gray-500 mb-8">
              Enter your new password below to access your account.
            </p>

            <form onSubmit={handleReset} className="space-y-5">
              {message && (
                <p className="text-green-600 bg-green-50 p-2 rounded-md text-center">
                  {message}
                </p>
              )}
              {error && (
                <p className="text-red-600 bg-red-50 p-2 rounded-md text-center">
                  {error}
                </p>
              )}

              {/* Password */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  New Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-medium text-white cursor-pointer"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>

              {/* Back to Login */}
              <p className="text-sm text-center text-gray-600 mt-4">
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Back to Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
