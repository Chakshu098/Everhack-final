import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container-wide pt-32 pb-16 max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="space-y-6 text-base text-muted-foreground">
          <p>By using EverHack, you agree to the following terms and conditions:</p>
          <ul className="list-disc ml-6">
            <li>You are responsible for the accuracy of your registration information.</li>
            <li>You will comply with all event rules and community guidelines.</li>
            <li>EverHack is not liable for any damages or losses incurred during event participation.</li>
            <li>We reserve the right to update these terms at any time.</li>
          </ul>
        </div>
      </section>
      <Footer />
    </div>
  );
}
