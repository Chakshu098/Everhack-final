import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Plus, Pencil, Trash2, LogOut, Shield, BarChart3, Users, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { mockDb, Event, User } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { EventFormDialog } from "@/components/admin/EventFormDialog";
import { DeleteEventDialog } from "@/components/admin/DeleteEventDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

export default function AdminDashboard() {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (!isLoading && !user && !localStorage.getItem("isAdmin")) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    if (user || localStorage.getItem("isAdmin")) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsData, usersData] = await Promise.all([
        mockDb.getEvents(),
        mockDb.getUsers()
      ]);
      setEvents(eventsData);
      setUsers(usersData);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ACTIONS ---------------- */
  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteOpen(true);
  };

  const handleTogglePublish = async (event: Event) => {
    try {
      const updatedEvent = { ...event, results_published: !event.results_published };
      await mockDb.updateEvent(updatedEvent);
      setEvents(events.map(e => e.id === event.id ? updatedEvent : e));
      toast({ title: "Updated", description: `Results ${updatedEvent.results_published ? "published" : "hidden"} for ${event.title}` });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update event", variant: "destructive" });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to ban/delete this user?")) return;
    try {
      await mockDb.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast({ title: "User Deleted", description: "User has been removed." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    }
  };
  const handleEndEvent = async (event: Event) => {
    if (!confirm(`Are you sure you want to end "${event.title}"? This will mark it as completed.`)) return;
    try {
      const updatedEvent = { ...event, status: 'completed' };
      // @ts-ignore - status type might be strict
      await mockDb.updateEvent(updatedEvent);
      // @ts-ignore
      setEvents(events.map(e => e.id === event.id ? updatedEvent : e));
      toast({ title: "Event Ended", description: "Event marked as completed." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to end event", variant: "destructive" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  /* ---------------- ANALYTICS DATA ---------------- */
  const participationData = events.map(e => ({
    name: e.title.length > 15 ? e.title.substring(0, 15) + "..." : e.title,
    participants: e.participants,
    max: e.max_participants
  }));

  const userGrowthData = [
    { month: "Jan", users: 50 },
    { month: "Feb", users: 80 },
    { month: "Mar", users: 150 },
    { month: "Apr", users: 220 },
    { month: "May", users: users.length * 5 }, // Mock growth based on real count
  ];

  if (isLoading) return null; // or spinner
  if (!isAdmin && !localStorage.getItem("isAdmin")) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar adminMode />

      {/* ---------- HEADER ---------- */}
      <section className="pt-32 pb-8 border-b">
        <div className="container-wide flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage events, users, and platform settings</p>
              </div>
            </div>
          </motion.div>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut size={16} className="mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </section>

      {/* ---------- CONTENT ---------- */}
      <section className="section-padding">
        <div className="container-wide">
          <Tabs defaultValue="events" className="space-y-8">
            <TabsList className="bg-muted p-1">
              <TabsTrigger value="events" className="px-6 gap-2"><Calendar size={16} /> Events</TabsTrigger>
              <TabsTrigger value="users" className="px-6 gap-2"><Users size={16} /> User Management</TabsTrigger>
              <TabsTrigger value="analytics" className="px-6 gap-2"><BarChart3 size={16} /> Analytics</TabsTrigger>
            </TabsList>

            {/* EVENTS TAB */}
            <TabsContent value="events" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">All Events</h2>
                <Button variant="hero" onClick={handleCreateEvent}>
                  <Plus size={16} className="mr-2" /> Host Event
                </Button>
              </div>

              <div className="glass-card rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50 text-sm">
                    <tr>
                      <th className="px-6 py-4 text-left">Event</th>
                      <th className="px-6 py-4 text-left">Stats</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Results</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {events.map(event => (
                      <tr key={event.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(event.start_date).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <span className="font-semibold text-primary">{event.participants}</span>
                            <span className="text-muted-foreground">/{event.max_participants}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 capitalize">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.status === 'upcoming' ? 'bg-blue-500/10 text-blue-500' :
                            event.status === 'ongoing' ? 'bg-green-500/10 text-green-500' :
                              'bg-gray-500/10 text-gray-500'
                            }`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={!!event.results_published}
                              onCheckedChange={() => handleTogglePublish(event)}
                            />
                            <Label className="text-xs text-muted-foreground">
                              {event.results_published ? "Published" : "Hidden"}
                            </Label>
                          </div>
                        </td>
                        <td className="px-6 py-4 flex justify-end gap-2">
                          <div className="flex justify-end gap-2">
                            {event.status !== 'completed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-600"
                                onClick={() => handleEndEvent(event)}
                              >
                                End Event
                              </Button>
                            )}
                            <Button size="icon" variant="ghost" onClick={() => handleEditEvent(event)}>
                              <Pencil size={14} />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(event)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* USERS TAB */}
            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Registered Users ({users.length})</h2>
              </div>
              <div className="glass-card rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50 text-sm">
                    <tr>
                      <th className="px-6 py-4 text-left">User</th>
                      <th className="px-6 py-4 text-left">Role</th>
                      <th className="px-6 py-4 text-left">Joined</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                            {u.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{u.full_name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 capitalize text-sm">{u.role}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(u.id)} disabled={u.role === 'admin'}>
                            Ban User
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* ANALYTICS TAB */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card border-none">
                  <CardHeader>
                    <CardTitle>Event Participation</CardTitle>
                    <CardDescription>Registrations vs Capacity</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={participationData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" fontSize={12} stroke="#888888" />
                        <YAxis fontSize={12} stroke="#888888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1e1e1e", border: "none" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Bar dataKey="participants" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="glass-card border-none">
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>New user registrations over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="month" fontSize={12} stroke="#888888" />
                        <YAxis fontSize={12} stroke="#888888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#1e1e1e", border: "none" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Line type="monotone" dataKey="users" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />

      {/* ---------- DIALOGS ---------- */}
      <EventFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        event={selectedEvent}
        onSuccess={fetchData}
      />

      <DeleteEventDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        event={selectedEvent}
        onSuccess={fetchData}
      />
    </div>
  );
}
