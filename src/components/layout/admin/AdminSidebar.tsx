import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Users,
  Contact,
  ArrowLeftRight,
  Settings,
  MessageCircle,
  MessageSquare,
  MailOpen,
  LogOut,
  HousePlus,
  PlusCircle,
  List,
  Building2,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onCollapseChange?: (val: boolean) => void;
  onMobileToggle?: (val: boolean) => void;
}

const AdminSidebar = ({
  collapsed = false,
  mobileOpen = false,
  onCollapseChange,
  onMobileToggle,
}: AdminSidebarProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  // 🧠 Get logged-in user and role
  const {user} = useAuth();
  const role = user?.role || "admin";
  const userId = user?.id || ""; // use this to build dynamic routes for agents/customers

  // ===============================
  // ROLE-BASED MENU ITEMS
  // ===============================
  const menuItems =
    role === "admin"
      ? [
          {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin/dashboard",
          },
          {
            name: "Properties",
            icon: Home,
            children: [
              {
                name: "All Properties",
                icon: PlusCircle,
                path: "/admin/properties",
              },
              {
                name: "Property Stats",
                icon: List,
                path: "/admin/property-statistics",
              },
            ],
          },
          {
            name: "Agents",
            icon: Users,
            children: [
              {
                name: "Add Agent*",
                icon: PlusCircle,
                path: "/admin/agents/add",
              },
              {
                name: "Agents List",
                icon: List,
                path: "/admin/agents/agent-list",
              },
              {
                name: "Add Properties*",
                icon: PlusCircle,
                path: "/admin/agents/add-properties",
              },
              {
                name: "Agents Property*",
                icon: Building2,
                path: "/admin/agents/property",
              },
            ],
          },
          {
            name: "Customers",
            icon: Contact,
            children: [
              {
                name: "Add Customer*",
                icon: PlusCircle,
                path: "/admin/customer/add",
              },
              {
                name: "Customers List",
                icon: List,
                path: "/admin/customers/customer-list",
              },
              {
                name: "Customers Property List*",
                icon: Building2,
                path: "/admin/customer/customer-property",
              },
            ],
          },
          {
            name: "Transactions*",
            icon: ArrowLeftRight,
            children: [
              {
                name: "Agents Transaction",
                icon: Users,
                path: "/admin/transection/agent-transection",
              },
              {
                name: "Customers Transaction",
                icon: Contact,
                path: "/admin/customer/customer-transection",
              },
            ],
          },
          { name: "Orders*", icon: HousePlus, path: "/admin/order" },
          { name: "Inbox*", icon: MailOpen, path: "/admin/inbox" },
          { name: "Chat*", icon: MessageCircle, path: "/admin/chat" },
          { name: "Reviews*", icon: MessageSquare, path: "/admin/reviews" },
          { name: "Settings*", icon: Settings, path: "/admin/settings" },
        ]
      : role === "agent"
      ? [
          // 👇 AGENT MENU (Dynamic based on login)
          {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin/dashboard",
          },
          {
            name: "My Properties",
            icon: Home,
            children: [
              {
                name: "Add Property",
                icon: PlusCircle,
                path: `/admin/agents/property/add`, // unique to this agent
              },
              {
                name: "My Property List",
                icon: Building2,
                path: `/admin/agents/property/list`, // unique to this agent
              },
            ],
          },
          {
            name: "Customers*",
            icon: Contact,
            children: [
              {
                name: "Add Customer",
                icon: PlusCircle,
                path: "/admin/customers/add",
              },
              {
                name: "Customer List",
                icon: List,
                path: "/admin/customers/customer-list",
              },
              {
                icon: ClipboardList,
                name: "Leads",
                path: "/admin/agents/lead",
              },
            ],
          },
          { name: "Inbox*", icon: MailOpen, path: "/admin/inbox" },
          { name: "Chat*", icon: MessageCircle, path: "/admin/chat" },
          { name: "Settings*", icon: Settings, path: "/admin/settings" },
        ]
      : [
          // 👇 CUSTOMER MENU
          {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin/dashboard",
          },
          {
            name: "My Properties",
            icon: Home,
            children: [
              {
                name: "My Property List",
                icon: Building2,
                path: `/admin/customer/${userId}/my-properties`,
              },
            ],
          },
          { name: "Inbox", icon: MailOpen, path: "/admin/inbox" },
          { name: "Chat", icon: MessageCircle, path: "/admin/chat" },
          { name: "Settings", icon: Settings, path: "/admin/settings" },
        ];

  // ===============================
  // Keep dropdown open for active route
  // ===============================
  useEffect(() => {
    for (const item of menuItems) {
      if (item.children) {
        const match = item.children.some((child) =>
          location.pathname.startsWith(child.path)
        );
        if (match) {
          setOpenDropdown(item.name);
          return;
        }
      }
    }
    setOpenDropdown(null);
  }, [location.pathname]);

  // ===============================
  // Render Sidebar
  // ===============================
  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen flex flex-col bg-[#1d2735] shadow-md z-50 transition-all duration-300 
        ${collapsed ? "w-20" : "w-64"} 
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {!collapsed && (
            <h1 className="text-xl font-bold text-blue-500">
              {role === "admin"
                ? "Admin Panel"
                : role === "agent"
                ? "Agent Panel"
                : "Customer Panel"}
            </h1>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => onCollapseChange?.(!collapsed)}
              className="text-gray-300 hover:text-white transition cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => onMobileToggle?.(false)}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-[#1d2735]">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-[#ffffff0f] transition text-gray-200 cursor-pointer ${
                      collapsed ? "justify-center" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      {!collapsed && <span>{item.name}</span>}
                    </div>
                    {!collapsed &&
                      (openDropdown === item.name ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      ))}
                  </button>

                  {!collapsed && openDropdown === item.name && (
                    <div className="ml-5 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.name}
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 text-sm rounded-md transition hover:bg-[#ffffff0f] text-gray-300 ${
                              isActive ? "bg-[#ffffff0f] text-white" : ""
                            }`
                          }
                        >
                          <child.icon size={16} />
                          <span>{child.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#ffffff0f] text-gray-200 transition ${
                      collapsed ? "justify-center" : ""
                    } ${isActive ? "bg-[#ffffff0f] text-white" : ""}`
                  }
                >
                  <item.icon size={20} />
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 text-white cursor-pointer"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => onMobileToggle?.(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
