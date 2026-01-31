import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Calendar,
  Settings,
  LogOut,
  User as UserIcon,
  Trophy,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { mockDb, Registration, User } from "@/lib/mockData";

// Profile type from mockData
// interface Profile { ... }

// Registration type from mockData
// interface Registration { ... }

// ... imports
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, isLoading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [profile, setProfile] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (!isLoading && isAdmin) {
      navigate("/admin");
    }
  }, [user, isLoading, isAdmin, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchRegistrations();
    }
  }, [user]);

  const fetchProfile = async () => {
    setProfile(user); // Auth user object has profile info
  };

  const fetchRegistrations = async () => {
    const regs = await mockDb.getRegistrations(user!.id);
    const events = await mockDb.getEvents();

    // Join events manually since we don't have SQL joins
    const enrichedRegs = regs.map(r => {
      const event = events.find(e => e.id === r.event_id);
      return {
        ...r,
        events: event || {
          id: r.event_id,
          title: 'Unknown Event',
          event_type: 'unknown',
          start_date: new Date().toISOString(),
          image_url: null
        }
      };
    });
    setRegistrations(enrichedRegs);
  };

  const handleCancelRegistration = async (eventId: string) => {
    if (!confirm("Are you sure you want to cancel your registration?")) return;
    try {
      await mockDb.cancelRegistration(user!.id, eventId);
      toast({ title: "Registration Cancelled", description: "You have been removed from the event." });
      fetchRegistrations();
    } catch (err) {
      toast({ title: "Error", description: "Failed to cancel registration.", variant: "destructive" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || "U";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const achievements = [
    { icon: Trophy, label: "Events Registered", value: registrations.length.toString() },
    { icon: Clock, label: "Hours Hacked", value: "0" },
    { icon: Calendar, label: "Member Since", value: new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-8 border-b border-border">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 flex items-center justify-center text-2xl font-bold text-primary-foreground overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-background flex items-center justify-center text-foreground">
                    {getInitials()}
                  </div>
                )}
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  Welcome back, {profile?.full_name?.split(" ")[0] || "User"}
                </h1>
                <p className="text-muted-foreground">{profile?.email || user.email}</p>
              </div>
            </motion.div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Registered Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold">
                    Your Registered Events
                  </h2>
                  <Link
                    to="/events"
                    className="text-primary text-sm hover:underline flex items-center gap-1"
                  >
                    Browse Events <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="space-y-4">
                  {registrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="group flex gap-4 glass-card rounded-xl p-4 hover-lift relative"
                    >
                      <Link to={`/events/${reg.events.id}`} className="absolute inset-0 z-0" />

                      <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden relative z-10">
                        {reg.events.image_url ? (
                          <img
                            src={reg.events.image_url}
                            alt={reg.events.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Calendar size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium capitalize">
                            {reg.events.event_type}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-xs font-medium capitalize">
                            {reg.status}
                          </span>
                        </div>
                        <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors truncate">
                          {reg.events.title}
                        </h3>
                        <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
                          <Calendar size={14} />
                          {new Date(reg.events.start_date).toLocaleDateString()}
                        </p>

                        <div className="mt-3">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 text-xs z-20 relative pointer-events-auto"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleCancelRegistration(reg.events.id);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center relative z-10 pointer-events-none">
                        <ChevronRight
                          size={20}
                          className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {registrations.length === 0 && (
                  <div className="glass-card rounded-xl p-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      You haven't registered for any events yet.
                    </p>
                    <Button asChild>
                      <Link to="/events">Explore Events</Link>
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 flex items-center justify-center text-3xl font-bold text-primary-foreground mx-auto mb-4 overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full bg-background flex items-center justify-center text-foreground">
                        {getInitials()}
                      </div>
                    )}
                  </div>
                  <h3 className="font-display font-semibold text-lg">
                    {profile?.full_name || "User"}
                  </h3>
                  <p className="text-muted-foreground text-sm">Developer</p>
                </div>

                <div className="space-y-4">
                  {achievements.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className="text-primary" />
                        <span className="text-muted-foreground text-sm">
                          {item.label}
                        </span>
                      </div>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-6" asChild>
                  <Link to="/profile/edit">
                    <UserIcon size={16} className="mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </motion.div>
// ... (rest of quick actions)

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="font-display font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="glass" className="w-full justify-start" asChild>
                    <Link to="/events">
                      <Calendar size={16} className="mr-2" />
                      Browse Events
                    </Link>
                  </Button>
                  <Button variant="glass" className="w-full justify-start" asChild>
                    <Link to="/events?type=hackathon">
                      <Trophy size={16} className="mr-2" />
                      Join Hackathon
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
