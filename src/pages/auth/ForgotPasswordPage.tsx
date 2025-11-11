/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/api/auth";
import herohouse from "@/assets/hero-house.jpg";
import Logo from "/public/vite.svg";
import { Link } from "react-router";
import { toast } from "sonner"; // ✅ Import Sonner

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await forgotPassword(email);

      // ✅ Show success toast
      toast.success(res.message || "Password reset link sent to your email.");
      setMessage(res.message || "Password reset link sent to your email.");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to send reset link.";
      toast.error(errorMsg); // 🔴 Toast error
      setError(errorMsg);
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
      {/* Blurred Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-lg"></div>

      {/* Main Card */}
      <div
        className="relative z-10 flex flex-col lg:flex-row w-[90%] max-w-5xl h-[600px] 
                    rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Left Section – Black Panel */}
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

        {/* Right Section – Forgot Password Form */}
        <div className="flex flex-col justify-center items-center w-full lg:w-[60%] bg-white px-10 py-12">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-1">
              Reset Your Password
            </h2>
            <p className="text-center text-sm text-gray-500 mb-8">
              Enter your email below to receive a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
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

              {/* Email Field */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-medium text-white cursor-pointer"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <p className="text-sm text-gray-600 text-center mt-3">
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

export default ForgotPasswordPage;
