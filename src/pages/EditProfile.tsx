import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { mockDb, mockAuth } from "@/lib/mockData";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";

const profileSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
    github_handle: z.string().optional(),
    linkedin_handle: z.string().optional(),
    avatar_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const AVATAR_SEEDS = ["Felix", "Aneka", "Zack", "Glenna", "Kim", "Jude", "Robert", "Janice"];

export default function EditProfile() {
    const { user, isLoading } = useAuth();

    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [selectedAvatarSeed, setSelectedAvatarSeed] = useState("");

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: "",
            bio: "",
            github_handle: "",
            linkedin_handle: "",
            avatar_url: "",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                full_name: user.full_name || "",
                bio: user.bio || "",
                github_handle: user.github_handle || "",
                linkedin_handle: user.linkedin_handle || "",
                avatar_url: user.avatar_url || "",
            });
            if (user.avatar_url && user.avatar_url.includes("dicebear")) {
                // try extracting seed
                const match = user.avatar_url.match(/seed=([^&]+)/);
                if (match) setSelectedAvatarSeed(match[1]);
            }
        }
    }, [user, form]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" />
            </div>
        );
    }

    const onSubmit = async (data: ProfileFormValues) => {
        setIsSaving(true);
        try {
            await mockAuth.updateProfile({
                full_name: data.full_name,
                bio: data.bio,
                github_handle: data.github_handle,
                linkedin_handle: data.linkedin_handle,
                avatar_url: data.avatar_url,
            });

            toast({
                title: "Profile updated",
                description: "Your changes have been saved successfully.",
            });
            // Force reload to reflect changes in Navbar etc since we rely on localStorage/mockDb
            window.location.reload();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const setAvatar = (seed: string) => {
        setSelectedAvatarSeed(seed);
        const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
        form.setValue("avatar_url", url, { shouldDirty: true });
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="container-wide py-32 max-w-2xl">
                <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all" onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </Button>

                <h1 className="font-display text-3xl font-bold mb-8">Edit Profile</h1>

                <div className="space-y-8">
                    {/* Avatar Selection */}
                    <div className="glass-card p-6 rounded-xl space-y-4">
                        <h3 className="font-semibold text-lg">Choose Avatar</h3>
                        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                            {AVATAR_SEEDS.map(seed => (
                                <button
                                    key={seed}
                                    type="button"
                                    onClick={() => setAvatar(seed)}
                                    className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${selectedAvatarSeed === seed ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'}`}
                                >
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt={seed} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-px bg-border flex-1" />
                            <span className="text-xs text-muted-foreground uppercase">Or enter custom URL</span>
                            <div className="h-px bg-border flex-1" />
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <FormField
                                control={form.control}
                                name="avatar_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Avatar URL (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Tell us about yourself..." className="resize-none h-24" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="github_handle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GitHub Handle</FormLabel>
                                            <FormControl>
                                                <Input placeholder="@username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="linkedin_handle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>LinkedIn URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://linkedin.com/in/..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-6">
                                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>Cancel</Button>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
