import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Trophy } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { GlitchText } from "@/components/ui/GlitchText";
import heroBg from "@/assets/hero-bg.jpg";
import eventCtf from "@/assets/event-ctf.jpg";
import eventHackathon from "@/assets/event-hackathon.jpg";
import eventWorkshop from "@/assets/event-workshop.jpg";

const featuredEvents = [
  {
    id: "cyber-siege-2026",
    title: "Cyber Siege 2026",
    type: "CTF",
    date: "Feb 15-17, 2026",
    participants: 2500,
    prize: "$50,000",
    image: eventCtf,
  },
  {
    id: "buildverse-hackathon",
    title: "BuildVerse Hackathon",
    type: "Hackathon",
    date: "Mar 8-10, 2026",
    participants: 1800,
    prize: "$100,000",
    image: eventHackathon,
  },
  {
    id: "web3-masterclass",
    title: "Web3 Masterclass",
    type: "Workshop",
    date: "Jan 20, 2026",
    participants: 500,
    prize: "Free",
    image: eventWorkshop,
  },
];

const stats = [
  { value: "50K+", label: "Developers" },
  { value: "200+", label: "Events Hosted" },
  { value: "$2M+", label: "Prizes Awarded" },
  { value: "100+", label: "Communities" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        </div>

        {/* Spline 3D Embed */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <iframe
            src="https://my.spline.design/webdiagram-QPECtGKA2e5iN27iHwYcvf3F/"
            className="w-full h-full border-0 pointer-events-auto"
            style={{ minHeight: "100vh" }}
            title="EverHack 3D"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container-wide text-center pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
              The Future of Tech Events
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            We Initiate{" "}
            <br className="hidden md:block" />
            <GlitchText
              text="The Innovations"
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-secondary"
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            The premier platform for tech communities to host and launch
            hackathons, CTFs, and workshops with high impact.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="hero" asChild>
              <Link to="/events">
                Explore Events <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button variant="hero-outline" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-3 bg-primary rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="section-padding border-y border-border bg-card/50">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Featured Events
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Discover upcoming hackathons, CTFs, and workshops from the world's
              leading tech communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/events/${event.id}`}
                  className="group block glass-card rounded-xl overflow-hidden hover-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                        {event.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} />
                        {event.participants.toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-secondary font-semibold">
                        <Trophy size={14} />
                        {event.prize}
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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg" asChild>
              <Link to="/events">
                View All Events <ArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/5" />
        <div className="container-wide relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 md:p-16 text-center"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              <GlitchText text="Ready to Host Your Event?" />
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of organizers who trust EverHack to power their
              hackathons, CTFs, and workshops.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" asChild>
                <Link to="/login?signup=true">Start For Free</Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
