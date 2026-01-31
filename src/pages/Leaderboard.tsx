import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Trophy, Medal, Crown, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { mockDb, Event } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface LeaderboardEntry {
    name: string;
    points: number;
    rank: number;
    avatar: string;
}

export default function Leaderboard() {
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [resultsPublished, setResultsPublished] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [leaderboardData, eventsData] = await Promise.all([
                mockDb.getLeaderboard(),
                mockDb.getEvents()
            ]);

            // Check if ANY event has results published
            const hasPublished = eventsData.some(e => e.results_published);
            setResultsPublished(hasPublished);
            setData(leaderboardData);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <div className="container-wide relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
                            Global <span className="text-primary">Rankings</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Top hackers and contributors in the EverHack ecosystem. Compete in events to earn points and climb the ladder.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="section-padding min-h-[50vh]">
                <div className="container-wide max-w-4xl">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin w-12 h-12 border-2 border-primary border-t-transparent rounded-full" />
                        </div>
                    ) : !resultsPublished ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-12 rounded-xl text-center border-dashed border-2 border-border"
                        >
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                <Lock size={32} className="text-muted-foreground" />
                            </div>
                            <h2 className="text-3xl font-display font-bold mb-4">Results Pending</h2>
                            <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
                                The judges are still deliberating or no events have finished yet. Check back later for the official rankings!
                            </p>
                            <Button asChild variant="outline">
                                <Link to="/events">Join Upcoming Events</Link>
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {data.map((entry, index) => (
                                <motion.div
                                    key={entry.rank}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`relative glass-card p-4 md:p-6 rounded-xl flex items-center gap-6 ${index === 0 ? 'border-primary/50 bg-primary/5' : ''}`}
                                >
                                    <div className="font-display text-2xl font-bold w-12 text-center">
                                        {index === 0 ? <Crown className="text-yellow-500 w-8 h-8 mx-auto" /> :
                                            index === 1 ? <Medal className="text-gray-400 w-8 h-8 mx-auto" /> :
                                                index === 2 ? <Medal className="text-amber-700 w-8 h-8 mx-auto" /> :
                                                    `#${entry.rank}`}
                                    </div>

                                    <div className="relative">
                                        <img
                                            src={entry.avatar}
                                            alt={entry.name}
                                            className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-border"
                                        />
                                        {index === 0 && (
                                            <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                TOP 1
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-display text-lg md:text-xl font-bold text-foreground">
                                            {entry.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Grandmaster</p>
                                    </div>

                                    <div className="text-right">
                                        <div className="font-display text-2xl font-bold text-primary">
                                            {entry.points.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Points</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
