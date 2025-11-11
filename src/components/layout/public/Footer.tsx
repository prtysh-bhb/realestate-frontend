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
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0b0d12] text-gray-300">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-2 py-16 border-b border-gray-700">
        {/* Brand Row */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          {/* Logo & Social */}
          <div className="flex flex-col gap-6 w-full md:w-[25%]">
            <div className="flex items-center gap-3">
                <img src="/src/assets/logo.jpg" className="w-24 h-20" alt="" />
            </div>
            <p className="text-sm leading-relaxed">
              Specializes in providing high-class tours for those in need.{" "}
              <span className="text-white">Contact Us</span>
            </p>

            <div className="flex flex-col gap-3 text-sm">
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-[#3151f3]" />
                101 E 129th St, East Chicago, IN 46312, US
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-[#3151f3]" /> 1-333-345-6868
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-[#3151f3]" /> themesflat@gmail.com
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 w-full md:w-[60%]">
            {/* Categories */}
            <div>
              <h3 className="text-white font-semibold mb-4">Categories</h3>
              <ul className="space-y-3 text-sm">
                <li>Pricing Plans</li>
                <li>Our Services</li>
                <li>About Us</li>
                <li>Contact Us</li>
              </ul>
            </div>

            {/* Our Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Our Company</h3>
              <ul className="space-y-3 text-sm">
                <li>Property For Sale</li>
                <li>Property For Rent</li>
                <li>Property For Buy</li>
                <li>Our Agents</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-white font-semibold mb-4">Newsletter</h3>
              <p className="text-sm mb-4">
                Your Weekly/Monthly Dose of Knowledge and Inspiration
              </p>
              <div className="flex items-center border-b border-gray-500 pb-1">
                <Mail size={16} className="text-[#3151f3] mr-2" />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-transparent w-full text-sm focus:outline-none text-gray-300 placeholder-gray-500"
                />
                <Send
                  size={18}
                  className="text-gray-400 hover:text-[#3151f3] cursor-pointer transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center md:justify-end mt-10 space-x-5">
          <span className="text-white font-medium">Follow Us:</span>
          <div className="flex space-x-4">
            {[Facebook, Linkedin, Twitter, Instagram, Youtube].map(
              (Icon, i) => (
                <div
                  key={i}
                  className="bg-[#1c1f29] hover:bg-[#3151f3] transition p-2 rounded-full cursor-pointer"
                >
                  <Icon size={18} />
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row justify-between text-sm text-gray-500">
        <p>©2024 Homzen. All Rights Reserved.</p>
        <div className="flex flex-wrap gap-5 mt-3 md:mt-0">
          <a href="#" className="hover:text-[#3151f3] transition">
            Terms Of Services
          </a>
          <a href="#" className="hover:text-[#3151f3] transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-[#3151f3] transition">
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
