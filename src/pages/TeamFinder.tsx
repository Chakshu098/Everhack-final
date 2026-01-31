import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { mockDb, Team, Event } from "@/lib/mockData";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Users, Search, Plus, UserPlus, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";

export default function TeamFinder() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [teams, setTeams] = useState<Team[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    // Create Team Form State
    const [newTeamName, setNewTeamName] = useState("");
    const [newTeamDesc, setNewTeamDesc] = useState("");
    const [newTeamEvent, setNewTeamEvent] = useState("");
    const [newTeamMaxMembers, setNewTeamMaxMembers] = useState(4);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [teamsData, eventsData] = await Promise.all([
            mockDb.getTeams(),
            mockDb.getEvents()
        ]);
        setTeams(teamsData);
        setEvents(eventsData);
        setLoading(false);
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast({ title: "Login Required", description: "You must be logged in to create a team.", variant: "destructive" });
            return;
        }
        setCreating(true);
        try {
            await mockDb.createTeam({
                name: newTeamName,
                description: newTeamDesc,
                event_id: newTeamEvent,
                leader_id: user.id,
                members: [user.id],
                looking_for: [], // Default empty for now
                max_members: newTeamMaxMembers
            });
            toast({ title: "Success", description: "Team created successfully!" });
            setCreateDialogOpen(false);
            fetchData();
        } catch (err) {
            toast({ title: "Error", description: "Failed to create team.", variant: "destructive" });
        } finally {
            setCreating(false);
        }
    };

    const handleJoinTeam = async (teamId: string) => {
        if (!user) {
            toast({ title: "Login Required", description: "Please login to join a team." });
            return;
        }
        try {
            await mockDb.joinTeam(teamId, user.id);
            toast({ title: "Joined!", description: "You have successfully joined the team." });
            fetchData();
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "Failed to join team.", variant: "destructive" });
        }
    };

    const filteredTeams = teams.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Header */}
            <section className="pt-32 pb-12 border-b border-border">
                <div className="container-wide">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="font-display text-4xl font-bold mb-2">Find Your Squad</h1>
                            <p className="text-muted-foreground text-lg">Connect with hackers, team up, and build something epic.</p>
                        </div>

                        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="hero" className="shrink-0">
                                    <Plus size={18} className="mr-2" /> Create Team
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border">
                                <DialogHeader>
                                    <DialogTitle>Create a New Team</DialogTitle>
                                    <DialogDescription>Start a new team and recruit members for an event.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateTeam} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label>Team Name</Label>
                                        <Input value={newTeamName} onChange={e => setNewTeamName(e.target.value)} required placeholder="e.g. Byte Busters" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Event</Label>
                                        <Select value={newTeamEvent} onValueChange={setNewTeamEvent} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an event" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {events.filter(e => e.status === 'upcoming' || e.status === 'ongoing').map(e => (
                                                    <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description & Requirements</Label>
                                        <Textarea value={newTeamDesc} onChange={e => setNewTeamDesc(e.target.value)} required placeholder="What are you building? Who do you need?" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <Label>Max Members</Label>
                                            <span className="text-sm text-muted-foreground">{newTeamMaxMembers} Members</span>
                                        </div>
                                        <Slider
                                            value={[newTeamMaxMembers]}
                                            onValueChange={(val) => setNewTeamMaxMembers(val[0])}
                                            max={4}
                                            min={2}
                                            step={1}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={creating}>
                                        {creating ? "Creating..." : "Create Team"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </section>

            {/* Search & List */}
            <section className="section-padding">
                <div className="container-wide">
                    <div className="mb-8 relative max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            placeholder="Search teams by name or keywords..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 boundary-2 border-primary border-t-transparent rounded-full" /></div>
                    ) : filteredTeams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTeams.map((team, idx) => {
                                const event = events.find(e => e.id === team.event_id);
                                const isMember = user && team.members.includes(user.id);

                                return (
                                    <motion.div
                                        key={team.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="glass-card p-6 rounded-xl hover-lift border border-white/5 flex flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-display text-xl font-bold">{team.name}</h3>
                                            <span className="text-xs px-2 py-1 rounded bg-secondary/20 text-secondary">
                                                {event?.title || "Unknown Event"}
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-6 flex-grow">{team.description}</p>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                            <div className="flex items-center gap-1">
                                                <Users size={14} />
                                                {team.members.length} / {team.max_members || 4} Members
                                            </div>
                                            {/* Add looking for skills here later */}
                                        </div>

                                        <div className="mt-auto flex gap-3">
                                            {isMember ? (
                                                <Button variant="outline" className="w-full cursor-default bg-primary/10 border-primary/20 hover:bg-primary/10">
                                                    Joined <Users size={14} className="ml-2" />
                                                </Button>
                                            ) : team.members.length >= (team.max_members || 4) ? (
                                                <Button variant="outline" disabled className="w-full opacity-50 cursor-not-allowed">
                                                    Team Full
                                                </Button>
                                            ) : (
                                                <Button className="w-full" onClick={() => handleJoinTeam(team.id)}>
                                                    Join Team <UserPlus size={14} className="ml-2" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon">
                                                <MessageSquare size={18} />
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 glass-card rounded-xl">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No Teams Found</h3>
                            <p className="text-muted-foreground mb-6">Be the first to create a team for an upcoming event!</p>
                            <Button onClick={() => setCreateDialogOpen(true)}>Create Team</Button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
