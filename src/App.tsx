import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import TwoFactorPage from "@/pages/auth/TwoFactorPage";
import TwoFactorSetup from "@/pages/auth/TwoFactorSetupPage";
import SocialCallback from "@/pages/auth/SocialCallback";

// Dashboards
import DashboardPage from "@/pages/dashboard/DashboardPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";

// Admin Pages
import AdminProfilePage from "@/pages/admin/profile/AdminProfilePage";
import ViewProfilePage from "@/pages/admin/profile/ViewProfilePage";
import AgentList from "@/pages/admin/agents/AgentList";
import AgentProfilePage from "@/pages/admin/agents/AgentProfile";
import AgentViewProfilePage from "@/pages/admin/agents/profile/AgentViewProfilePage";
import AgenteditProfilePage from "@/pages/admin/agents/profile/AgentProfilePage";
import CustomerList from "@/pages/admin/customer/CustomerList";
import CustomerProfilePage from "@/pages/admin/customer/CustomerProfilePage";

// Property Pages
import AddProperty from "@/pages/admin/agents/property/AddProperty";
import EditProperty from "@/pages/admin/agents/property/EditProperty";
import PropertyList from "@/pages/admin/agents/property/PropertyList";
import ViewProperty from "@/pages/admin/agents/property/ViewProperty";
import PropertyListAdmin from "@/pages/admin/property/PropertyList";
import PropertyStatsAdmin from "@/pages/admin/property/PropertyStats";
import SingleProperty from "@/components/sections/home/SingleProperty";

// Leads
import LeadList from "@/pages/admin/agents/lead/LeadList";
import ViewLead from "@/pages/admin/agents/lead/ViewLead";

// Customer Pages
import CustomerLayout from "@/pages/customer/CustomerLayout";
import CustomerProfile from "@/pages/customer/CustomerProfile";
import ProfileEditForm from "@/pages/customer/ProfileEditForm";
import PropertyFilters from "@/pages/customer/PropertyFilters";
import PropertyView from "@/pages/customer/PropertyView";

// Routing Utils
import ProtectedRoute from "@/lib/ProtectedRoute";
import PublicRoute from "@/lib/PublicRoute";
import { ApiInterceptor } from "./api/ApiInterceptor";

function App() {
  return (
    <BrowserRouter>
    <ApiInterceptor />
      <Routes>
        {/* ---------------- AUTH ROUTES ---------------- */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/two-factor" element={<TwoFactorPage />} />
          <Route path="/two-factor-setup" element={<TwoFactorSetup />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/social-callback" element={<SocialCallback />} />
        </Route>

        {/* ---------------- USER DASHBOARD ---------------- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* ---------------- CUSTOMER PROFILE & PROPERTIES ---------------- */}
        <Route element={<CustomerLayout />}>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <CustomerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <ProfileEditForm />
              </ProtectedRoute>
            }
          />

          {/* Property Listing */}
          <Route path="/properties/rent" element={<PropertyFilters />} />
          <Route path="/properties/sale" element={<PropertyFilters />} />
          <Route path="/properties/view/:id" element={<PropertyView />} />
        </Route>

        {/* ---------------- ADMIN & AGENT DASHBOARD ---------------- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "agent"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* ---------------- ADMIN PROFILE ROUTES ---------------- */}
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/view-profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ViewProfilePage />
            </ProtectedRoute>
          }
        />

        {/* ---------------- AGENT PROFILE ROUTES ---------------- */}
        <Route
          path="/agents/profile"
          element={
            <ProtectedRoute allowedRoles={["agent", "admin"]}>
              <AgenteditProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/view-profile"
          element={
            <ProtectedRoute allowedRoles={["agent", "admin"]}>
              <AgentViewProfilePage />
            </ProtectedRoute>
          }
        />

        {/* ---------------- LEADS ---------------- */}
        <Route
          path="/admin/agents/lead"
          element={
            <ProtectedRoute allowedRoles={["admin", "agent"]}>
              <LeadList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agents/lead/view/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "agent"]}>
              <ViewLead />
            </ProtectedRoute>
          }
        />

        {/* ---------------- AGENT MANAGEMENT ---------------- */}
        <Route
          path="/admin/agents/agent-list"
          element={
            <ProtectedRoute allowedRoles={["admin", "agent"]}>
              <AgentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agents/view/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "agent"]}>
              <AgentProfilePage />
            </ProtectedRoute>
          }
        />

        {/* ---------------- CUSTOMER MANAGEMENT ---------------- */}
        <Route
          path="/admin/customers/customer-list"
          element={
            <ProtectedRoute allowedRoles={["admin", "agent"]}>
              <CustomerList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers/view/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "agent"]}>
              <CustomerProfilePage />
            </ProtectedRoute>
          }
        />

        {/* ---------------- PROPERTIES (AGENT & ADMIN) ---------------- */}
        {/* Agent-side */}
        <Route
          path="/admin/agents/property/add"
          element={
            <ProtectedRoute allowedRoles={["agent", "admin"]}>
              <AddProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agents/property/list"
          element={
            <ProtectedRoute allowedRoles={["agent", "admin"]}>
              <PropertyList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agents/property/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["agent", "admin"]}>
              <EditProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agents/property/view/:id"
          element={
            <ProtectedRoute allowedRoles={["agent", "admin"]}>
              <ViewProperty />
            </ProtectedRoute>
          }
        />

        {/* Admin-side */}
        <Route
          path="/admin/properties"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PropertyListAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/property-statistics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PropertyStatsAdmin />
            </ProtectedRoute>
          }
        />

        {/* ---------------- PUBLIC PROPERTY VIEW ---------------- */}
        <Route path="/property/:id" element={<SingleProperty />} />
      </Routes>

      {/* Global Toast Notifications */}
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: "15px" },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
