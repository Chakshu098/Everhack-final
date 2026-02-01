import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockDb, Partner } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  image_url: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  is_online: boolean | null;
  max_participants: number | null;
  prize_pool: string | null;
  difficulty: string | null;
  status: string;
  rules: string | null;
  partners?: Partner[];
  participants: number; // Add participants
}

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onSuccess: () => void;
}

const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  event_type: z.enum(["Hackathon", "CTF", "Workshop"]),
  image_url: z.string().url().optional().or(z.literal("")),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  location: z.string().max(200).optional(),
  is_online: z.boolean(),
  max_participants: z.number().positive().optional().nullable(),
  prize_pool: z.string().max(100).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional().nullable(),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]),
  rules: z.string().max(5000).optional(),
  partners: z.array(z.object({
    name: z.string().min(1),
    logo_url: z.string().url(),
    website_url: z.string().url().optional().or(z.literal(""))
  })).optional(),
});

export function EventFormDialog({
  open,
  onOpenChange,
  event,
  onSuccess,
}: EventFormDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast(); // Ensure toast is destructured
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "Hackathon" as "Hackathon" | "CTF" | "Workshop",
    image_url: "",
    start_date: "",
    end_date: "",
    location: "",
    is_online: false,
    max_participants: "",
    prize_pool: "",
    difficulty: "" as "" | "beginner" | "intermediate" | "advanced",
    status: "upcoming" as "upcoming" | "ongoing" | "completed" | "cancelled",
    rules: "",
    partners: [] as Partner[],
  });

  // Partner input state
  const [newPartner, setNewPartner] = useState<Partner>({ name: "", logo_url: "", website_url: "" });

  const addPartner = () => {
    if (!newPartner.name || !newPartner.logo_url) {
      toast({ title: "Error", description: "Name and Logo URL are required", variant: "destructive" });
      return;
    }
    setFormData({ ...formData, partners: [...formData.partners, newPartner] });
    setNewPartner({ name: "", logo_url: "", website_url: "" });
  };

  const removePartner = (index: number) => {
    const updated = [...formData.partners];
    updated.splice(index, 1);
    setFormData({ ...formData, partners: updated });
  };

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        event_type: event.event_type as "Hackathon" | "CTF" | "Workshop",
        image_url: event.image_url || "",
        start_date: event.start_date.split("T")[0],
        end_date: event.end_date.split("T")[0],
        location: event.location || "",
        is_online: event.is_online || false,
        max_participants: event.max_participants?.toString() || "",
        prize_pool: event.prize_pool || "",
        difficulty: (event.difficulty as "" | "beginner" | "intermediate" | "advanced") || "",
        status: event.status as "upcoming" | "ongoing" | "completed" | "cancelled",
        rules: event.rules || "",
        partners: event.partners || [],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        event_type: "Hackathon",
        image_url: "",
        start_date: "",
        end_date: "",
        location: "",
        is_online: false,
        max_participants: "",
        prize_pool: "",
        difficulty: "",
        status: "upcoming",
        rules: "",
        partners: [],
      });
    }
    setErrors({});
  }, [event, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Check if there are unsaved partner details
    if (newPartner.name || newPartner.logo_url) {
      toast({
        title: "Unsaved Partner",
        description: "You have entered partner details but haven't clicked 'Add'. Please add the partner or clear the fields.",
        variant: "destructive",
      });
      return;
    }

    const dataToValidate = {
      title: formData.title,
      description: formData.description || undefined,
      event_type: formData.event_type,
      image_url: formData.image_url || undefined,
      start_date: formData.start_date,
      end_date: formData.end_date,
      location: formData.location || undefined,
      is_online: formData.is_online,
      max_participants: formData.max_participants
        ? parseInt(formData.max_participants)
        : null,
      prize_pool: formData.prize_pool || undefined,
      difficulty: formData.difficulty || null,
      status: formData.status,
      rules: formData.rules || undefined,
      partners: formData.partners,
    };

    const result = eventSchema.safeParse(dataToValidate);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Auto-assign random cyber image if empty
    const CYBER_IMAGES = [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2070", // Matrix code
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070", // Cyberpunk city
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=2787", // Tech workshop
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=2070", // Technology
      "https://images.unsplash.com/photo-1563206767-5b1d97289374?auto=format&fit=crop&q=80&w=2072", // Abstract neon
      "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=2070", // Code screen
    ];

    const finalImageUrl = formData.image_url || CYBER_IMAGES[Math.floor(Math.random() * CYBER_IMAGES.length)];

    const payload = {
      title: formData.title,
      description: formData.description || null,
      event_type: formData.event_type,
      image_url: finalImageUrl,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString(),
      location: formData.location || null,
      is_online: formData.is_online,
      max_participants: formData.max_participants
        ? parseInt(formData.max_participants)
        : null,
      prize_pool: formData.prize_pool || null,
      difficulty: formData.difficulty || null,
      status: formData.status,
      rules: formData.rules || null,
      partners: formData.partners || [],
      created_by: user?.id,
    };

    try {
      if (event) {
        // Prepare update object
        const updatePayload = {
          id: event.id,
          ...payload,
          // mockDb types might differ slightly, ensuring compatibility
          description: payload.description || "",
          image_url: payload.image_url || "",
          location: payload.location || "",
          max_participants: payload.max_participants || 0,
          prize_pool: payload.prize_pool || "",
          difficulty: payload.difficulty || "",
          rules: (payload.rules || "").split('\n'), // simple split for mock data
          partners: payload.partners,
          timeline: [] // mock data requirement
        };

        // We need to cast or adapt the payload to match Event interface in mockMock
        // For simplicity in this mock fix, we'll try to match the mockDb signature or just use any if types cascade too much
        // Inspecting mockData.ts: updateEvent takes Event.

        // Let's look at mockData.ts Event interface again to be sure.
        // It has rules?: string[];

        // We will construct a minimal valid Event object for the mock
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockEventData: any = {
          id: event.id,
          ...payload,
          rules: payload.rules ? [payload.rules] : [], // simple adaptation
          description: payload.description || "",
          image_url: payload.image_url || "",
          location: payload.location || "",
          max_participants: payload.max_participants || 0,
          prize_pool: payload.prize_pool || "",
          difficulty: payload.difficulty || "",
          partners: payload.partners,
          participants: event.participants, // Preserve existing participants
        };

        await mockDb.updateEvent(mockEventData);
        toast({ title: "Success", description: "Event updated successfully" });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockEventData: any = {
          ...payload,
          rules: payload.rules ? [payload.rules] : [],
          description: payload.description || "",
          image_url: payload.image_url || "",
          location: payload.location || "",
          max_participants: payload.max_participants || 0,
          prize_pool: payload.prize_pool || "",
          difficulty: payload.difficulty || "",
          partners: payload.partners,
          participants: 0, // Initialize participants
          timeline: []
        };
        await mockDb.createEvent(mockEventData);

        toast({ title: "Success", description: "Event created successfully" });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {event ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Event title"
              />
              {errors.title && (
                <p className="text-destructive text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Event description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Event Type *
              </label>
              <select
                value={formData.event_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    event_type: e.target.value as "hackathon" | "ctf" | "workshop",
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="CTF">CTF</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "upcoming" | "ongoing" | "completed" | "cancelled",
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {errors.start_date && (
                <p className="text-destructive text-sm mt-1">
                  {errors.start_date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {errors.end_date && (
                <p className="text-destructive text-sm mt-1">
                  {errors.end_date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Event location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as "" | "beginner" | "intermediate" | "advanced",
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select difficulty</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Participants
              </label>
              <input
                type="number"
                value={formData.max_participants}
                onChange={(e) =>
                  setFormData({ ...formData, max_participants: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. 500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Prize Pool
              </label>
              <input
                type="text"
                value={formData.prize_pool}
                onChange={(e) =>
                  setFormData({ ...formData, prize_pool: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. $50,000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_online}
                  onChange={(e) =>
                    setFormData({ ...formData, is_online: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-border bg-muted text-primary focus:ring-primary/50"
                />
                <span className="text-sm font-medium">Online Event</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Rules</label>
              <textarea
                value={formData.rules}
                onChange={(e) =>
                  setFormData({ ...formData, rules: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Event rules and guidelines"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Partners & Sponsors</label>
              <div className="space-y-3 mb-4">
                {formData.partners.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <img src={p.logo_url} alt={p.name} className="w-8 h-8 rounded object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.website_url}</p>
                    </div>
                    <Button type="button" size="sm" variant="ghost" className="text-destructive h-8 w-8 p-0" onClick={() => removePartner(idx)}>
                      <span className="sr-only">Remove</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 2 2v2" /></svg>
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 items-start">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <input
                    type="text"
                    placeholder="Partner Name"
                    value={newPartner.name}
                    onChange={e => setNewPartner({ ...newPartner, name: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-muted border border-border text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Logo URL"
                    value={newPartner.logo_url}
                    onChange={e => setNewPartner({ ...newPartner, logo_url: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-muted border border-border text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Website URL (optional)"
                    value={newPartner.website_url}
                    onChange={e => setNewPartner({ ...newPartner, website_url: e.target.value })}
                    className="col-span-2 px-3 py-2 rounded-lg bg-muted border border-border text-sm"
                  />
                </div>
                <Button type="button" size="sm" onClick={addPartner} className="mt-1">Add</Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="hero" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : event
                  ? "Update Event"
                  : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
