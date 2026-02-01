import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { EventRegistrationForm } from "@/components/EventRegistrationForm";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Calendar,
  Users,
  Trophy,
  MapPin,
  Clock,
  ArrowLeft,
  Check,
  ExternalLink,
} from "lucide-react";
import { mockDb, Event } from "@/lib/mockData";
import { GlitchText } from "@/components/ui/GlitchText";

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (eventId) {
      mockDb.getEventById(eventId).then((data) => {
        if (data) setEvent(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <Button asChild>
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage = ((event.participants || 0) / (event.max_participants || 1)) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[60vh] min-h-[400px]">
        <img
          src={event.image_url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-24 left-0 right-0 container-wide">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Events
          </Link>
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 container-wide pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {event.event_type}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                Upcoming
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              <GlitchText text={event.title} />
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {event.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="font-display text-2xl font-semibold mb-4">
                  About This Event
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {event.longDescription || event.description}
                </p>
              </motion.div>

              {/* Rules */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="font-display text-2xl font-semibold mb-4">
                  Rules & Requirements
                </h2>
                <ul className="space-y-3">
                  {event.rules?.map((rule, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <Check
                        size={18}
                        className="text-primary mt-0.5 flex-shrink-0"
                      />
                      {rule}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="font-display text-2xl font-semibold mb-6">
                  Event Timeline
                </h2>
                <div className="space-y-4">
                  {event.timeline?.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 items-start glass-card p-4 rounded-lg"
                    >
                      <div className="text-primary font-mono text-sm whitespace-nowrap">
                        {item.time}
                      </div>
                      <div className="w-px h-6 bg-border" />
                      <div className="text-foreground">{item.event}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Partners & Sponsors */}
              {event.partners && event.partners.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="font-display text-2xl font-semibold mb-6">Partners & Sponsors</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {event.partners.map((partner, index) => (
                      <a
                        key={index}
                        href={partner.website_url || "#"}
                        target={partner.website_url ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="glass-card p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-muted/50 transition-colors group text-center"
                      >
                        <img src={partner.logo_url} alt={partner.name} className="w-16 h-16 object-contain grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100" />
                        <div className="space-y-1">
                          <p className="font-semibold text-sm">{partner.name}</p>
                          {partner.website_url && (
                            <div className="flex items-center justify-center text-xs text-muted-foreground gap-1">
                              Visit <ExternalLink size={10} />
                            </div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card rounded-xl p-6 sticky top-28"
              >
                {/* Quick Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-foreground">
                    <Calendar size={18} className="text-primary" />
                    <span>{new Date(event.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground">
                    <Clock size={18} className="text-primary" />
                    <span>{new Date(event.start_date).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground">
                    <MapPin size={18} className="text-primary" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground">
                    <Trophy size={18} className="text-secondary" />
                    <span className="font-semibold">{event.prize_pool} in prizes</span>
                  </div>
                </div>

                {/* Participants */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      <Users size={14} className="inline mr-1" />
                      {(event.participants || 0).toLocaleString()} registered
                    </span>
                    <span className="text-muted-foreground">
                      {event.max_participants.toLocaleString()} max
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <Button variant="hero" className="w-full" onClick={() => setShowRegister(true)}>
                  Register Now
                </Button>
                {/* Registration Modal */}
                {showRegister && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-background p-8 rounded-xl shadow-xl w-full max-w-md relative">
                      <button
                        className="absolute top-2 right-2 text-xl font-bold text-muted-foreground hover:text-foreground"
                        onClick={() => setShowRegister(false)}
                        aria-label="Close"
                      >
                        ×
                      </button>
                      <h2 className="font-display text-2xl font-semibold mb-4 text-center">Event Registration</h2>
                      <EventRegistrationForm eventId={event.id} onSuccess={() => setShowRegister(false)} />
                    </div>
                  </div>
                )}

                {/* Organizer */}
                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Organized by
                  </p>
                  <p className="font-medium text-foreground">{event.organizer}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section >

      <Footer />
    </div >
  );
}
