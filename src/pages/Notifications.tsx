import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlitchText } from "@/components/ui/GlitchText";
import { Bell, Info, CheckCircle, AlertTriangle } from "lucide-react";

// Mock notifications data (enhanced)
const notifications = [
  {
    id: 1,
    type: "success",
    title: "Registration Confirmed",
    message: "You have successfully registered for Cyber Siege 2026. Prepare for the challenge.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "New Event: BuildVerse",
    message: "BuildVerse Hackathon is now open for registration. Join the revolution.",
    time: "1 day ago",
    read: true,
  },
  {
    id: 3,
    type: "warning",
    title: "Profile Incomplete",
    message: "Please add your skills to your profile to get better team recommendations.",
    time: "3 days ago",
    read: true,
  },
  {
    id: 4,
    type: "info",
    title: "Welcome to EverHack",
    message: "Thank you for joining the premier tech event platform.",
    time: "1 week ago",
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="text-primary" size={20} />;
    case "warning":
      return <AlertTriangle className="text-secondary" size={20} />;
    default:
      return <Info className="text-muted-foreground" size={20} />;
  }
};

export default function Notifications() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Bell className="text-primary w-8 h-8" />
            <h1 className="font-display text-4xl font-bold">
              <GlitchText text="Notifications" />
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Stay updated with your latest activities, system alerts, and mission briefs.
          </p>
        </motion.div>

        <div className="space-y-4 max-w-3xl cursor-default">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative glass-card p-6 rounded-xl border-l-4 ${notification.read ? "border-border/50 opacity-80" : "border-primary"
                } hover:bg-card/80 transition-all duration-300 group`}
            >
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-semibold text-lg mb-1 ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {notification.message}
                  </p>
                </div>
              </div>
              {!notification.read && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </motion.div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Bell size={48} className="mx-auto mb-4 opacity-20" />
              <p>No new notifications at this time.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
