/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  User, 
  Home, 
  Mail, 
  Edit, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bell,
  FileText,
  Tag,
  MapPin,
  MessageCircle,
  CalendarDays,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { getReminderById, Reminder } from "@/api/agent/reminders";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatReadableDate } from "@/helpers/customer_helper";

const ShowReminder = () => {
  const { id } = useParams();
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReminder();
  }, [id]);

  const fetchReminder = async () => {
    try {
      setLoading(true);
      const response = await getReminderById(Number(id));
      
      if (response.success && response.data) {
        setReminder(response.data.reminder);
      } else {
        toast.error("Failed to fetch reminder");
        navigate('/agent/reminders');
      }
    } catch (error: any) {
      toast.error("Error fetching reminder: " + (error.message || ""));
      navigate('/agent/reminders');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'snoozed': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reminder...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!reminder) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center text-gray-500">
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Reminder not found</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Reminder Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reminder Overview Card */}
            <Card className={`bg-gradient-to-br from-blue-50 to-emerald-50 border-2 border-blue-200 rounded-2xl shadow-xl overflow-hidden`}>
              <CardContent className="p-0">
                {/* Reminder Header */}
                <div className={`bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{reminder.title}</h2>
                        <p className="text-white/80 text-sm mt-1 capitalize">{reminder.type} • {reminder.priority} priority</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge 
                          className={`${getStatusBadgeColor(reminder.status)} backdrop-blur-sm border text-sm font-semibold px-3 py-1`}
                        >
                          {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                        </Badge>
                        <Badge 
                          className={`${getPriorityBadgeColor(reminder.priority)} backdrop-blur-sm border text-sm font-semibold px-3 py-1`}
                        >
                          {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                      <div>
                        <p className="text-3xl font-bold flex items-center gap-2">
                          <Clock className="w-7 h-7" />
                          {formatReadableDate(reminder.remind_at, true)}
                        </p>
                        <p className="text-white/80 text-lg">Reminder Time</p>
                      </div>
                      {reminder.completed_at && (
                        <div className="text-right">
                          <p className="text-white/80 text-sm">Completed At</p>
                          <p className="text-xl font-bold">{formatReadableDate(reminder.completed_at, true)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reminder Description */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{reminder.description}</p>
                </div>

                {/* Additional Notes */}
                {reminder.notes && (
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                      Additional Notes
                    </h3>
                    <p className="text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-200">
                      {reminder.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Entities */}
            <Card className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  Related Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Customer</p>
                          <p className="text-sm text-gray-500">{reminder?.customer?.name ?? ""}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-blue-600">{reminder?.customer?.email ?? ''}</p>
                        <p className="text-sm text-gray-500">{reminder?.customer?.phone ?? ''}</p>
                      </div>
                    </div>

                    {/* Property Information */}
                    {reminder.property && (
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Home className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Property</p>
                            <p className="text-sm text-gray-500">{reminder.property.title}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Link to={`/agent/properties/${reminder.property_id}`} className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            View
                          </Link>
                          <p className="text-sm text-gray-500 truncate max-w-[120px]">{reminder.property.address}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Inquiry Information */}
                    {reminder.inquiry && (
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Inquiry</p>
                            <p className="text-sm text-gray-500">Related inquiry</p>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-purple-600">#{reminder.inquiry.id}</span>
                      </div>
                    )}

                    {/* Appointment Information */}
                    {reminder.appointment && (
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <CalendarDays className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Appointment</p>
                            <p className="text-sm text-gray-500">Scheduled meeting</p>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-amber-600">#{reminder.appointment.id}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notification Status */}
            <Card className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  Notification Status
                </h3>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                    reminder.email_sent ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        reminder.email_sent ? 'bg-emerald-100' : 'bg-amber-100'
                      }`}>
                        <Mail className={`w-5 h-5 ${reminder.email_sent ? 'text-emerald-600' : 'text-amber-600'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Email Sent</p>
                        <p className="text-sm text-gray-500">Notification email</p>
                      </div>
                    </div>
                    {reminder.email_sent ? (
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                    )}
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                    reminder.notification_sent ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        reminder.notification_sent ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Bell className={`w-5 h-5 ${reminder.notification_sent ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Push Notification</p>
                        <p className="text-sm text-gray-500">In-app alert</p>
                      </div>
                    </div>
                    {reminder.notification_sent ? (
                      <CheckCircle className="w-6 h-6 text-blue-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  {reminder.email_error && (
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <p className="text-sm font-semibold text-red-800">Email Error</p>
                      <p className="text-sm text-red-600 mt-1">{reminder.email_error}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reminder Information */}
            <Card className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-gray-600" />
                  Reminder Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 capitalize">
                      {reminder.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Priority</span>
                    <Badge className={`${getPriorityBadgeColor(reminder.priority)} capitalize`}>
                      {reminder.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className={`${getStatusBadgeColor(reminder.status)} capitalize`}>
                      {reminder.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  Timestamps
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Remind At</p>
                    <p className="text-sm text-gray-600">{formatReadableDate(reminder.remind_at, true)}</p>
                  </div>
                  {reminder.snoozed_until && (
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Snoozed Until</p>
                      <p className="text-sm text-gray-600">{formatReadableDate(reminder.snoozed_until, true)}</p>
                    </div>
                  )}
                  {reminder.completed_at && (
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Completed At</p>
                      <p className="text-sm text-gray-600">{formatReadableDate(reminder.completed_at, true)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">{formatReadableDate(reminder.created_at, true)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-600">{formatReadableDate(reminder.updated_at, true)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate(`/agent/reminders/${reminder.id}/edit`)}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Reminder
                  </Button>
                  <Button
                    onClick={() => navigate('/agent/reminders')}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Reminders
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ShowReminder;