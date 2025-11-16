/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SocialCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the token from the URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token) {
      // Save token in localStorage
      localStorage.setItem("token", token);

      // If backend also sends user data as a query param, save that too
      if (user) {
        try {
          localStorage.setItem(
            "user",
            JSON.stringify(JSON.parse(decodeURIComponent(user)))
          );
        } catch {
          // fallback if not JSON encoded
          localStorage.setItem("user", decodeURIComponent(user));
        }
      }

      // Redirect to dashboard
      navigate("/dashboard");
    } else {
      // If token not found, redirect to login
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">Authenticating, please wait...</p>
      </div>
    </div>
  );
};

export default SocialCallback;
