import { logout } from '@/api/auth';
import { User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const handleLogout = (): void => {
  localStorage.clear();
  window.location.href = "/";
  logout();
};

const UserMenuItems = ({ 
  className = "" 
}) => {
  return (
    <div className={className}>
      {/* Profile Menu Item */}
      <div className="">
        <Link to={'/profile'}
          className="flex items-center cursor-pointer w-full text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 py-2"
        >
          <span className="mr-3 text-base">
            <User size={20} />
          </span>
          {'Profile'}
        </Link>
      </div>

      {/* Logout Menu Item */}
      <div className="pt-2 border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center cursor-pointer w-full text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 py-2"
        >
          <LogOut size={20} /> 
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenuItems;