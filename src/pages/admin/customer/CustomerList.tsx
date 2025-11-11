/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Trash2,
  X,
  AlertTriangle,
  Filter,
  FileDown,
} from "lucide-react";
import { exportUsers } from "@/api/admin/userExport";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { getCustomers, Customer } from "@/api/customer/customerlist";
import {
  activateCustomer,
  deactivateCustomer,
  deleteCustomer,
} from "@/api/customer/customerActions";
import { toast } from "sonner";

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeactivatePopup, setShowDeactivatePopup] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const params: Record<string, any> = { page, search };
        if (filter === "active") params.is_active = 1;
        if (filter === "inactive") params.is_active = 0;

        const data = await getCustomers(page, search);
        if (data.success) {
          setCustomers(data.data.customers || []);
          setTotalPages(data.data.pagination.last_page || 1);
        } else setError("Failed to fetch customers.");
      } catch {
        setError("Failed to fetch customers.");
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, [page, search, filter]);

  const refresh = async () => {
    const params: Record<string, any> = { page, search };
    if (filter === "active") params.is_active = 1;
    if (filter === "inactive") params.is_active = 0;
    const data = await getCustomers(page, search);
    setCustomers(data.data.customers || []);
  };

  const handleActivate = async (id: number) => {
    try {
      await activateCustomer(id);
      toast.success("Customer activated successfully");
      refresh();
    } catch {
      toast.error("Failed to activate customer");
    }
  };

  const openDeactivatePopup = (customer: Customer) => {
    setSelectedCustomer(customer);
    setReason("");
    setShowDeactivatePopup(true);
  };

  const confirmDeactivate = async () => {
    if (!reason.trim()) {
      toast.error("Please enter a reason");
      return;
    }
    try {
      await deactivateCustomer(selectedCustomer!.id, reason);
      toast.success("Customer deactivated successfully");
      setShowDeactivatePopup(false);
      refresh();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to deactivate customer"
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCustomer(id);
      toast.success("Customer deleted successfully");
      refresh();
    } catch {
      toast.error("Failed to delete customer");
    }
  };

  const badge = (isActive: boolean) =>
    isActive
      ? "bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-400"
      : "bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-400";

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 bg-white dark:bg-[#1f2937] rounded-2xl min-h-screen">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
            Customers List
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-800 w-full sm:w-64">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 w-full"
              />
            </div>

            {/* Export */}
            <button
              onClick={async () => {
                try {
                  toast.info("Preparing your download...");
                  await exportUsers(
                    "customer",
                    filter === "active"
                      ? 1
                      : filter === "inactive"
                      ? 0
                      : undefined
                  );
                  toast.success("Export successful!");
                } catch {
                  toast.error("Failed to export users");
                }
              }}
              className="flex items-center cursor-pointer justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition"
            >
              <FileDown size={16} /> Export
            </button>

            {/* Filter */}
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-800">
              <Filter size={16} className="text-gray-400 mr-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* 🖥️ Table for Desktop */}
        <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-[900px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <th className="py-3 px-4 text-left font-medium">Name</th>
                <th className="py-3 px-4 text-left font-medium">Email</th>
                <th className="py-3 px-4 text-left font-medium">Created</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">2FA</th>
                <th className="py-3 px-4 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {c.email}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${badge(
                          c.is_active
                        )}`}
                      >
                        {c.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {c.two_factor_enabled ? (
                        <span className="bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-400 px-2 py-1 text-xs rounded-full">
                          Enabled
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 dark:bg-gray-700/20 dark:text-gray-400 px-2 py-1 text-xs rounded-full">
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 flex justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/customers/view/${c.id}`)
                        }
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300"
                      >
                        <Eye size={16} />
                      </button>
                      {c.is_active ? (
                        <button
                          onClick={() => openDeactivatePopup(c)}
                          className="text-yellow-600 shadow-sm p-2 rounded-md hover:text-yellow-700 text-sm font-medium cursor-pointer"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(c.id)}
                          className="text-green-600 shadow-sm p-2 px-4 rounded-md hover:text-green-700 text-sm font-medium cursor-pointer"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-700/20 rounded-md text-red-600 dark:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 🪄 Grid Cards for Tablet + Mobile */}
        <div className="grid sm:grid-cols-2 gap-4 lg:hidden">
          {customers.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    {c.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {c.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    2FA:{" "}
                    {c.two_factor_enabled ? (
                      <span className="text-green-600">Enabled</span>
                    ) : (
                      <span className="text-gray-400">Disabled</span>
                    )}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${badge(
                    c.is_active
                  )}`}
                >
                  {c.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => navigate(`/admin/customers/view/${c.id}`)}
                    className="p-2 text-gray-500 hover:text-indigo-600"
                  >
                    <Eye size={16} />
                  </button>
                  {c.is_active ? (
                    <button
                      onClick={() => openDeactivatePopup(c)}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-md hover:bg-yellow-200"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(c.id)}
                      className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md hover:bg-green-200"
                    >
                      Activate
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ⚠️ Deactivate Popup */}
        {showDeactivatePopup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-[90%] max-w-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <AlertTriangle className="text-yellow-500" size={20} />
                  Deactivate Customer
                </h4>
                <button
                  onClick={() => setShowDeactivatePopup(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Provide a reason for deactivating{" "}
                <span className="font-semibold">{selectedCustomer?.name}</span>.
              </p>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full border rounded-md p-3 text-sm focus:ring-2 focus:ring-yellow-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 mb-4"
                placeholder="Enter reason..."
              ></textarea>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeactivatePopup(false)}
                  className="px-4 py-2 rounded-md border text-sm text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeactivate}
                  className="px-4 py-2 rounded-md text-sm bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CustomerList;
