/**
 * Footer Component
 * Professional multi-column footer with newsletter and social links
 * Inspired by Zillow, Redfin, and modern real estate platforms
 */

import {
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Send,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-secondary-900 via-secondary-950 to-secondary-900 text-secondary-300 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
      </div>

      {/* Top Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-16 md:py-20 border-b border-secondary-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img
                src="/assets/logo.jpg"
                className="w-28 h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                alt="Logo"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-secondary-400">
              Specializes in providing high-class real estate services for those seeking their dream home.{" "}
              <Link to="/contact" className="text-primary-400 hover:text-primary-300 font-semibold">
                Contact Us
              </Link>
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-primary-400 transition-colors group"
              >
                <div className="p-2 bg-primary-900/20 rounded-lg group-hover:bg-primary-900/30 transition-colors">
                  <MapPin size={16} className="text-primary-400" />
                </div>
                <span className="flex-1">101 E 129th St, East Chicago, IN 46312, US</span>
              </a>
              <a
                href="tel:1-333-345-6868"
                className="flex items-center gap-3 hover:text-primary-400 transition-colors group"
              >
                <div className="p-2 bg-primary-900/20 rounded-lg group-hover:bg-primary-900/30 transition-colors">
                  <Phone size={16} className="text-primary-400" />
                </div>
                <span>1-333-345-6868</span>
              </a>
              <a
                href="mailto:themesflat@gmail.com"
                className="flex items-center gap-3 hover:text-primary-400 transition-colors group"
              >
                <div className="p-2 bg-primary-900/20 rounded-lg group-hover:bg-primary-900/30 transition-colors">
                  <Mail size={16} className="text-primary-400" />
                </div>
                <span>themesflat@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Home className="w-5 h-5 text-primary-400" />
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Pricing Plans", path: "#" },
                { name: "Our Services", path: "#" },
                { name: "About Us", path: "/about" },
                { name: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-primary-400 transition-colors hover:translate-x-1 inline-block"
                  >
                    → {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Properties</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Property For Sale", path: "/properties/sale" },
                { name: "Property For Rent", path: "/properties/rent" },
                { name: "Featured Properties", path: "/properties/sale" },
                { name: "Our Agents", path: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-primary-400 transition-colors hover:translate-x-1 inline-block"
                  >
                    → {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-sm mb-6 text-secondary-400 leading-relaxed">
              Subscribe to get the latest property updates and exclusive offers
            </p>
            <div className="relative">
              <div className="flex items-center bg-secondary-800 rounded-xl overflow-hidden border border-secondary-700 focus-within:border-primary-500 transition-colors">
                <Mail size={18} className="text-primary-400 ml-4" />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-transparent w-full px-4 py-3 text-sm focus:outline-none text-white placeholder-secondary-500"
                />
                <button className="p-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all">
                  <Send size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-8">
              <p className="text-white font-semibold mb-4 text-sm">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { Icon: Facebook, href: "#" },
                  { Icon: Linkedin, href: "#" },
                  { Icon: Twitter, href: "#" },
                  { Icon: Instagram, href: "#" },
                  { Icon: Youtube, href: "#" },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-secondary-800 hover:bg-gradient-to-br hover:from-primary-600 hover:to-primary-700 transition-all p-2.5 rounded-lg"
                  >
                    <Icon size={18} className="text-secondary-300 hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-secondary-500">
        <p>©{currentYear} Homzen. All Rights Reserved.</p>
        <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
          <Link to="#" className="hover:text-primary-400 transition-colors">
            Terms Of Services
          </Link>
          <Link to="#" className="hover:text-primary-400 transition-colors">
            Privacy Policy
          </Link>
          <Link to="#" className="hover:text-primary-400 transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
