/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router";
import { login } from "@/api/auth";
import { toast } from "sonner"; // ✅ Import Sonner toast
import google from "@/assets/Google.svg";
import apple from "@/assets/apple.svg";
import facebook from "@/assets/Facebook.svg";
import bgImage from "@/assets/hero-house.jpg";
import Logo from "/public/vite.svg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);

      if (data.success && data.requires_2fa) {
        toast.info("Two-factor authentication required");
        navigate("/two-factor", { state: { user_id: data.user_id } });
        return;
      }

      if (data.success && data.data?.token) {
        const user = data.data.user;
        const token = data.data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        const role = user.role || "agent";
        localStorage.setItem("role", role);

        toast.success("Login successful!");

        if (role === "admin" || role === "agent" || role === "customer") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.message || "Invalid credentials");
        setError(data.message || "Invalid credentials");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid credentials";
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
      {/* Blurred Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-lg"></div>

      {/* Main Auth Card */}
      <div className="relative z-10 flex flex-col lg:flex-row w-[90%] max-w-5xl h-[600px] rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Section */}
        <div
          className="hidden lg:flex flex-col justify-center items-center text-white
          bg-[url('/src/assets/login-image.jpg')] bg-center bg-cover bg-full w-[40%] p-10 relative
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

        {/* Right Section – Login Form */}
        <div className="flex flex-col justify-center items-center w-full lg:w-[60%] bg-white px-10 py-12">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-1">
              Welcome Back
            </h2>
            <p className="text-center text-sm text-gray-500 mb-8">
              Sign in to continue to RealEstate.
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md text-center">
                  {error}
                </p>
              )}

              {/* Email */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
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
                <div className="flex justify-end mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-medium text-white cursor-pointer"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Social Buttons */}
              <div className="text-center mt-6">
                <p className="text-gray-500 text-sm mb-3">Sign in with</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() =>
                      (window.location.href = `${
                        import.meta.env.VITE_BACKEND_URL
                      }/auth/google/redirect`)
                    }
                    className="p-2 border rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    <img src={google} alt="Google" className="w-5" />
                  </button>
                  <button
                    onClick={() =>
                      (window.location.href = `${
                        import.meta.env.VITE_BACKEND_URL
                      }/auth/apple/redirect`)
                    }
                    className="p-2 border rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    <img src={apple} alt="Apple" className="w-5" />
                  </button>
                  <button
                    onClick={() =>
                      (window.location.href = `${
                        import.meta.env.VITE_BACKEND_URL
                      }/auth/facebook/redirect`)
                    }
                    className="p-2 border rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    <img src={facebook} alt="Facebook" className="w-5" />
                  </button>
                </div>
              </div>

              {/* Signup Link */}
              <p className="text-sm text-center text-gray-600 mt-6">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
