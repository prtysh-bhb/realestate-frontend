import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAgentProfile, AgentProfile } from "@/api/agent/agentprofile";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AgentDetailsTab from "@/pages/admin/agents/components/AgentDetailsTab";
import AgentActivityLogsTab from "@/pages/admin/agents/components/AgentActivityLogsTab";
import AgentPerformanceTab from "@/pages/admin/agents/components/AgentPerformanceTab";
import { Phone, MapPin, User, Mail } from "lucide-react";

const AgentProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchAgentProfile(id!);
        if (data.success) setAgent(data.data);
        else setError("Failed to load agent profile");
      } catch (err) {
        console.error(err);
        setError("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  if (loading)
    return (
      <AdminLayout>
        <div className="text-center py-10 text-gray-500">Loading profile...</div>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout>
        <div className="text-center text-red-500 py-10">{error}</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="bg-white dark:bg-[#1f2937] rounded-2xl shadow-md overflow-hidden">
        {/* 🟣 Cover Banner */}
        <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 rounded-t-2xl overflow-hidden">
          <img
            src={agent?.image || `https://i.pravatar.cc/800?u=${agent?.id}`}
            alt="cover"
            className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm"
          />
        </div>

        {/* 🧑 Agent Header */}
        <div className="relative -mt-16 sm:-mt-20 px-4 sm:px-8 md:px-10 flex flex-col sm:flex-row sm:items-end sm:gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0 self-center sm:self-start">
            <img
              src={agent?.image || `https://i.pravatar.cc/150?u=${agent?.id}`}
              alt={agent?.name || "Agent"}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl object-cover"
            />
          </div>

          {/* Agent Info Card */}
          <div className="mt-4 sm:mt-0 bg-white dark:bg-[#1f2937] w-full rounded-xl shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between gap-4">
            {/* Left side - Name + Email */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center sm:justify-start gap-2">
                {agent?.name || "Unnamed Agent"}
                {agent?.is_active && (
                  <span className="text-green-500 text-sm font-semibold">
                    ● Active
                  </span>
                )}
              </h1>
              <p className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 mt-1 break-all">
                <Mail size={15} />
                {agent?.email || "Not available"}
              </p>
            </div>

            {/* Right side - Meta Info */}
            <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2 text-gray-700 dark:text-gray-300 text-sm">
              <div className="flex items-center gap-1">
                <Phone size={15} /> {agent?.phone || "N/A"}
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={15} /> {agent?.location || "Unknown"}
              </div>
              <div className="flex items-center gap-1">
                <User size={15} />{" "}
                {agent?.created_at
                  ? `Joined ${new Date(agent.created_at).toLocaleDateString()}`
                  : "Joined Date: N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* 🧭 Tabs Section */}
        <div className="mt-8 px-4 sm:px-8 md:px-10 pb-8">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 border-b border-gray-200 dark:border-gray-700 mb-6">
              <TabsTrigger
                value="details"
                className="pb-2 text-gray-700 dark:text-gray-200 font-medium border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="pb-2 text-gray-700 dark:text-gray-200 font-medium border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
              >
                Activity Logs
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="pb-2 text-gray-700 dark:text-gray-200 font-medium border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600"
              >
                Performance Tracking
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <AgentDetailsTab agent={agent!} />
            </TabsContent>

            <TabsContent value="activity">
              <AgentActivityLogsTab agentId={agent!.id} />
            </TabsContent>

            <TabsContent value="performance">
              <AgentPerformanceTab agentId={agent!.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AgentProfilePage;
