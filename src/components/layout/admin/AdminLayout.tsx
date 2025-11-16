import { ReactNode, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-blue-900/40 dark:to-slate-900 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapseChange={setCollapsed}
        onMobileToggle={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-200 ${
          collapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Header */}
        <Header onMenuClick={() => setMobileOpen(true)} />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
