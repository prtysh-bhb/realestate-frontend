import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import UserMenuItems from './UserMenuItems';

interface HeaderProps{
    scrolled: boolean;
}

const UserDropdown = ({ scrolled }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Username Button with Dropdown Arrow */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx("flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer",
        scrolled ? "text-black hover:text-blue-600" : "text-white hover:text-blue-600")}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <span className="font-medium capitalize">Hi, {user?.name}</span>
        <ChevronDown size={20} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute p-5 right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in-0 zoom-in-95">
          {/* Menu Items */}
          <UserMenuItems />
        </div>
      )}
    </div>
  );
};

export default UserDropdown;