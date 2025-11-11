/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { register } from "@/api/auth";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner"; // ✅ Import toast
import bgImage from "/assets/hero-house.jpg";
import Logo from "/public/vite.svg";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match"); // ⚠️ Toast for mismatch
      setLoading(false);
      return;
    }

    try {
      const data = await register(name, email, password, role);

      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        toast.success("Account created successfully! 🎉");
        navigate("/two-factor-setup");
      } else {
        toast.error("Registration failed");
        setError("Registration failed");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error during registration";
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
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-lg"></div>

      {/* Main Signup Card */}
      <div
        className="relative z-10 flex flex-col lg:flex-row w-[90%] max-w-5xl h-[650px] 
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

        {/* Right Section – Signup Form */}
        <div className="flex flex-col justify-center items-center w-full lg:w-[60%] bg-white px-10 py-12">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-1">
              Create an Account
            </h2>
            <p className="text-center text-sm text-gray-500 mb-8">
              Fill in your details below to get started.
            </p>

            <form onSubmit={handleSignup} className="space-y-5">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md text-center">
                  {error}
                </p>
              )}

              {/* Full Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="customer"
                      checked={role === "customer"}
                      onChange={(e) => setRole(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600 cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700">Customer</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="agent"
                      checked={role === "agent"}
                      onChange={(e) => setRole(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600 cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700">Agent</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-medium text-white cursor-pointer"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>

              <p className="text-sm text-gray-600 text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
