import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, Users, Trophy, Filter, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { mockDb, Event } from "@/lib/mockData";
import { GlitchText } from "@/components/ui/GlitchText";

// Replaced by mockDb call

const filterOptions = ["All", "Hackathon", "CTF", "Workshop"];

export default function Events() {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get("type") || "All";
  const [activeFilter, setActiveFilter] = useState(
    filterOptions.find((f) => f.toLowerCase() === initialFilter.toLowerCase()) || "All"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    mockDb.getEvents().then(setEvents);
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesFilter =
      activeFilter === "All" || event.event_type === activeFilter;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 border-b border-border">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              <GlitchText text="Discover Events" />
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Find and join the most exciting hackathons, CTFs, and workshops in
              the tech community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 border-b border-border bg-card/30">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              <div className="flex gap-2">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeFilter === filter
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding">
        <div className="container-wide">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link
                    to={`/events/${event.id}`}
                    className="group block glass-card rounded-xl overflow-hidden hover-lift border border-white/5 hover:border-primary/50 transition-colors duration-500"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                          {event.event_type}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-xs font-medium capitalize">
                          {event.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {new Date(event.start_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users size={14} />
                          {event.participants.toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-secondary font-semibold">
                          <Trophy size={14} />
                          {event.prize_pool}
                        </div>
                        <span className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">
                No events found matching your criteria.
              </p>
              <Button variant="outline" onClick={() => {
                setActiveFilter("All");
                setSearchQuery("");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
