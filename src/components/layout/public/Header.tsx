/**
 * Header Component
 * Professional sticky navigation with glassmorphism
 * Inspired by Zillow, Redfin, and modern real estate platforms
 */

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home as HomeIcon, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import UserDropdown from "@/pages/admin/customer/components/UserDropdown";
import UserMenuItems from "@/pages/admin/customer/components/UserMenuItems";
import { APP_NAME } from "@/constants";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const location = useLocation();

  const isDashboard = location.pathname.startsWith("/dashboard") || location.pathname=="/";

  useEffect(() => {
    // only add scroll listener on dashboard page
    if (isDashboard) {
      const handleScroll = () => {
        setScrolled(window.scrollY > 30);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      // reset when leaving dashboard
      setScrolled(true);
    }
  }, [isDashboard]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const navLinks = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "For Rent", path: "/properties/rent" },
    { name: "For Sale", path: "/properties/sale" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500",
          scrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-800"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          {/* LOGO */}
          {/* <Link
            to="/"
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <img
              src="/assets/logo.jpg"
              className="w-20 h-15 rounded-lg transition-shadow"
              alt="Logo"
            />
          </Link> */}
          <Link to="/" className="inline-block group">
            <div className="flex items-center gap-3 backdrop-blur-sm px-3 py-2 rounded-2xl transition-all duration-300 group-hover:scale-105">
              <Building2 className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </div>
          </Link>

          {/* NAV LINKS (Desktop) */}
          <nav
            className={clsx(
              "hidden md:flex items-center gap-2 font-semibold transition-all"
            )}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  "relative px-4 py-2 rounded-xl transition-all group",
                  scrolled
                    ? isActive(link.path)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    : isActive(link.path)
                      ? "text-white bg-white/20 backdrop-blur-sm"
                      : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                )}
              >
                {link.name}
                <span
                  className={clsx(
                    "absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 bg-blue-600 transition-all duration-300",
                    isActive(link.path) ? "w-8" : "w-0 group-hover:w-8"
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* LOGIN BUTTON (Desktop) */}
          <div className="hidden md:block">
            {!token ? (
              <Button
                onClick={() => navigate("/login")}
                className={clsx(
                  "font-bold rounded-xl px-6 py-3 transition-all duration-300 transform hover:scale-105",
                  scrolled
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                    : "bg-white/95 hover:bg-white text-blue-700 backdrop-blur-sm shadow-lg shadow-white/50 hover:shadow-xl"
                )}
              >
                Login / Register
              </Button>
            ) : (
              <UserDropdown scrolled={scrolled} />
            )}
          </div>

          {/* MOBILE MENU ICON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={clsx(
              "md:hidden p-2 rounded-lg transition-all",
              scrolled
                ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                : "text-white hover:bg-white/10 backdrop-blur-sm"
            )}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Sliding Drawer */}
            <motion.div
              className="md:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl shadow-2xl border-l border-white/20 dark:border-secondary-700/20 z-50 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl border-b border-secondary-200 dark:border-secondary-700 p-6 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Menu</h2>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
                >
                  <X size={22} className="text-secondary-600 dark:text-secondary-400" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col p-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={clsx(
                      "px-4 py-3 rounded-xl font-semibold transition-all",
                      isActive(link.path)
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="px-6">
                <hr className="border-secondary-200 dark:border-secondary-700" />
              </div>

              {/* Auth Section */}
              <div className="p-6">
                {!token ? (
                  <Button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/login");
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all transform hover:scale-105"
                  >
                    Login / Register
                  </Button>
                ) : (
                  <UserMenuItems />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;