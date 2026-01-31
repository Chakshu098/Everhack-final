
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface EventRegistrationFormProps {
  eventId: string;
  onSuccess?: () => void;
}

export function EventRegistrationForm({ eventId, onSuccess }: EventRegistrationFormProps) {
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agree) {
      setError("You must agree to the rules and terms.");
      return;
    }
    setLoading(true);
    // TODO: Replace with actual registration logic (API call)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast({
        title: "Registration Successful!",
        description: "You have been registered for the event.",
        variant: "default",
      });
      if (onSuccess) onSuccess();
    }, 1000);
  };

  if (success) {
    return <div className="text-green-600 font-semibold">Registration successful!</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={e => setFullName(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <Input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Institution / Organization"
        value={institution}
        onChange={e => setInstitution(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Team Name (optional)"
        value={teamName}
        onChange={e => setTeamName(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Team Members (comma separated, optional)"
        value={teamMembers}
        onChange={e => setTeamMembers(e.target.value)}
      />
      <div>
        <label className="block mb-1 text-sm font-medium">Experience Level</label>
        <select
          className="w-full border border-input rounded-md px-3 py-2 bg-background text-base md:text-sm"
          value={experience}
          onChange={e => setExperience(e.target.value)}
          required
        >
          <option value="">Select...</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
      <textarea
        className="w-full border border-input rounded-md px-3 py-2 bg-background text-base md:text-sm"
        placeholder="Skills / Interests (optional)"
        value={skills}
        onChange={e => setSkills(e.target.value)}
        rows={2}
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={agree}
          onChange={e => setAgree(e.target.checked)}
          id="agree"
          required
        />
        <label htmlFor="agree" className="text-sm">I agree to the event rules and terms.</label>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Registering..." : "Submit Registration"}
      </Button>
    </form>
  );
}
