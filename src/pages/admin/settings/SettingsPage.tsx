import { useState } from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Bell, Lock, User, Mail, Globe, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  });

  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl">
              <Settings className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {[
                    { icon: User, label: "Profile", active: true },
                    { icon: Lock, label: "Security" },
                    { icon: Bell, label: "Notifications" },
                    { icon: Globe, label: "Language" },
                    { icon: Moon, label: "Appearance" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        item.active
                          ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <item.icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-600 dark:text-emerald-400" />
                  Profile Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Bell size={20} className="text-blue-600 dark:text-emerald-400" />
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{key} Notifications</span>
                      <button
                        onClick={() => setNotifications({ ...notifications, [key]: !value })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? "bg-blue-600 dark:bg-emerald-600" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  {darkMode ? <Moon size={20} className="text-blue-600 dark:text-emerald-400" /> : <Sun size={20} className="text-blue-600" />}
                  Appearance
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Use dark theme across the application</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      darkMode ? "bg-blue-600 dark:bg-emerald-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
