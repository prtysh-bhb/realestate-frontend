import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import UserDropdown from "@/pages/admin/customer/components/UserDropdown";
import UserMenuItems from "@/pages/admin/customer/components/UserMenuItems";

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
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "For Rent", path: "/properties/rent" },
    { name: "For Sale", path: "/properties/sale" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500",
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-200"
          : "bg-transparent"
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-tight transition-all"
        >
          <img src="/src/assets/logo.jpg" className="w-20 h-15" alt="" />
        </Link>

        {/* NAV LINKS (Desktop) */}
        <nav
          className={clsx(
            "hidden md:flex space-x-8 font-medium transition-all",
            scrolled ? "text-black" : "text-white"
          )}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="relative hover:text-blue-700 transition group"
            >
              {link.name}
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-700 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* LOGIN BUTTON (Desktop) */}
        <div className="hidden md:block">
        {!token ? (
          <Button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2 transition-all cursor-pointer"
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
            "md:hidden transition",
            scrolled ? "text-black hover:text-blue-600" : "text-white hover:text-blue-600"
          )}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div
        className={clsx(
          "md:hidden transition-all duration-500 overflow-hidden",
          menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col space-y-4 bg-white/95 border-t p-5 text-gray-700 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition"
            >
              {link.name}
            </Link>
          ))}
          {!token ? (
            <Button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2 transition-all cursor-pointer"
            >
              Login / Register
            </Button>
          ) : (
            <>
              <hr />
              <UserMenuItems />
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;