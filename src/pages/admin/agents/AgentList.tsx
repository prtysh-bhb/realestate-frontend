/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { getAgents, Agent } from "@/api/agent/agentlist";

const AgentList = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAgents(page, search);

        if (data.success) {
          setAgents(data.data.agents || []);
          setTotalPages(data.data.pagination.last_page || 1);
        } else {
          setError("Failed to fetch agents.");
        }
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch agents.");
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, [page, search]);

  const badge = (isActive: boolean) =>
    isActive
      ? "bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-400"
      : "bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-400";

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 bg-white dark:bg-[#1f2937] rounded-2xl h-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
            Agents List
          </h2>

          <div className="flex items-center w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-800">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search agents..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 w-full"
            />
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <p className="text-center text-gray-500 py-8">Loading agents...</p>
        )}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}

        {/* Responsive Layout */}
        {!loading && !error && (
          <>
            {/* Desktop Table View (lg and up) */}
            <div className="hidden lg:block overflow-x-auto border-gray-200 border rounded-lg scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
              <table className="min-w-[820px] w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    <th className="py-3 px-4 text-left font-medium">Agent</th>
                    <th className="py-3 px-4 text-left font-medium">Email</th>
                    <th className="py-3 px-4 text-left font-medium">2FA</th>
                    <th className="py-3 px-4 text-left font-medium">Created</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-center font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-6 text-center text-gray-500 dark:text-gray-400"
                      >
                        No agents found.
                      </td>
                    </tr>
                  ) : (
                    agents.map((agent) => (
                      <tr
                        key={agent.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-800 dark:text-gray-100 font-medium">
                          {agent.name}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {agent.email}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {agent.two_factor_enabled ? "Enabled" : "Disabled"}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {new Date(agent.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${badge(
                              agent.is_active
                            )}`}
                          >
                            {agent.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4 flex justify-center gap-2">
                          <button
                            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer"
                            onClick={() =>
                              navigate(`/admin/agents/view/${agent.id}`)
                            }
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-700/20 text-blue-600 dark:text-blue-400">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-700/20 text-red-600 dark:text-red-400">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Tablet + Mobile Card View */}
            <div className="grid sm:grid-cols-2 gap-4 lg:hidden">
              {agents.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-6 col-span-2">
                  No agents found.
                </p>
              ) : (
                agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#1f2937] shadow-sm flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://i.pravatar.cc/60?u=${agent.id}`}
                          alt={agent.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {agent.name}
                          </h3>
                          <p className="text-xs text-gray-500">{agent.email}</p>
                          <p className="text-xs text-gray-500">
                            2FA:{" "}
                            {agent.two_factor_enabled ? "Enabled" : "Disabled"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${badge(
                          agent.is_active
                        )}`}
                      >
                        {agent.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700 pt-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/agents/view/${agent.id}`)
                        }
                        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                      >
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-700/20 text-blue-600 dark:text-blue-400">
                        <Edit size={14} />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-700/20 text-red-600 dark:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AgentList;
