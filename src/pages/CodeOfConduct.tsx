import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function CodeOfConduct() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container-wide pt-32 pb-16 max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-8">Code of Conduct</h1>
        <div className="space-y-6 text-base text-muted-foreground">
          <p>EverHack is committed to providing a safe, inclusive, and respectful environment for all participants. By joining our events, you agree to:</p>
          <ul className="list-disc ml-6">
            <li>Treat everyone with respect and kindness</li>
            <li>Refrain from harassment, discrimination, or inappropriate behavior</li>
            <li>Report any violations to event organizers immediately</li>
            <li>Follow all event rules and instructions from staff</li>
          </ul>
          <p>Violations may result in removal from the event and future participation bans.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
