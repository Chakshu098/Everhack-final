import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockDb } from "@/lib/mockData";
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
  event_type: z.enum(["hackathon", "ctf", "workshop"]),
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
});

export function EventFormDialog({
  open,
  onOpenChange,
  event,
  onSuccess,
}: EventFormDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "hackathon" as "hackathon" | "ctf" | "workshop",
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
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        event_type: event.event_type as "hackathon" | "ctf" | "workshop",
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
      });
    } else {
      setFormData({
        title: "",
        description: "",
        event_type: "hackathon",
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
      });
    }
    setErrors({});
  }, [event, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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

    const payload = {
      title: formData.title,
      description: formData.description || null,
      event_type: formData.event_type,
      image_url: formData.image_url || null,
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
                <option value="hackathon">Hackathon</option>
                <option value="ctf">CTF</option>
                <option value="workshop">Workshop</option>
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
