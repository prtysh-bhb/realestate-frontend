/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import ChatScreen from "@/pages/ChatScreen";
import { Loader2 } from "lucide-react";

const AgentChatPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      //
      
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      </AdminLayout>
    );
  }

  const currentUser = {
    id: '1',
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    role: 'agent' as const,
  };

  return (
    <AdminLayout>
      <ChatScreen currentUser={currentUser} />
    </AdminLayout>
  );
};

export default AgentChatPage;
