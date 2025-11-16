import { useState, useRef, useEffect } from "react";
import { Bell, Moon, Sun, Search, Menu, User, Pencil, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/api/auth";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const avatarUrl = user?.avatar_url || "/default-avatar.png";

  const role = user?.role || "customer";

  const profilePathMap: Record<string, string> = {
    admin: "/admin/profile",
    agent: "/agent/profile",
    customer: "/customer/profile",
  };

  const editProfilePathMap: Record<string, string> = {
    admin: "/admin/profile/edit",
    agent: "/agent/profile/edit",
    customer: "/customer/profile/edit",
  };

  const profilePath = profilePathMap[role];
  const editProfilePath = editProfilePathMap[role];

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    navigate('/');
  };

  // Mock notifications
  const notifications = [
    { id: 1, title: "New property listed", message: "3 properties added today", time: "5m ago", unread: true },
    { id: 2, title: "Agent request", message: "New agent signup pending", time: "1h ago", unread: true },
    { id: 3, title: "System update", message: "Platform maintenance scheduled", time: "2h ago", unread: false },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-6 py-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 shadow-sm">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:shadow-sm transition-all">
          <Search className="text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 sm:w-64 md:w-80 border-none focus:ring-0 text-sm bg-transparent placeholder-gray-500 text-gray-900 dark:text-white outline-none"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 relative">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"></span>
          </button>

          {/* Notification Dropdown */}
          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{notifications.filter(n => n.unread).length} unread messages</p>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${
                      notif.unread ? "bg-gray-50 dark:bg-gray-800/30" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2.5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  View all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
          >
            <img
              src={avatarUrl}
              alt="user"
              className="w-8 h-8 rounded-full border-2 border-blue-200 dark:border-emerald-800 object-cover shadow-sm"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || "User"}</p>
              <p className="text-xs text-blue-600 dark:text-emerald-400 capitalize">{role}</p>
            </div>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{user?.role}</p>
              </div>

              <ul className="py-1 text-sm">
                <li>
                  <Link
                    to={profilePath}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} />
                    <span>View Profile</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={editProfilePath}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Pencil size={16} />
                    <span>Edit Profile</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>

              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
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
