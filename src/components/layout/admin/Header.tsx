import { useState, useRef, useEffect } from "react";
import { Bell, Moon, Search, Menu, User, Pencil, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const avatarUrl = user?.avatar_url || "/default-avatar.png";

  const role = user?.role || "customer";

  const profilePathMap: Record<string, string> = {
    admin: "/admin/view-profile",
    agent: "/agent/view-profile",
    customer: "/customer/view-profile",
  };

  const editProfilePathMap: Record<string, string> = {
    admin: "/admin/profile",
    agent: "/agents/profile",
    customer: "/customer/profile",
  };

  const profilePath = profilePathMap[role];
  const editProfilePath = editProfilePathMap[role];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center bg-white px-4 sm:px-6 py-4 shadow-sm sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden text-gray-700 hover:text-blue-600"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2">
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-40 sm:w-64 border-none focus:ring-0 text-sm bg-transparent placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5 relative">
        <button className="hover:text-blue-600">
          <Moon size={18} />
        </button>

        <button className="relative hover:text-blue-600">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <img
            src={avatarUrl}
            alt="user"
            className="w-8 h-8 rounded-full border hover:scale-105 transition-transform cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)} 
          />

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-100 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>

              <ul className="py-1 text-sm text-gray-700">
                <li>
                  <Link
                    to={profilePath}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} /> View Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to={editProfilePath}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Pencil size={16} /> Edit Profile
                  </Link>
                </li>
              </ul>

              <div className="border-t">
                <button
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
