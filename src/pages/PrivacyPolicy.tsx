import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container-wide pt-32 pb-16 max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-base text-muted-foreground">
          <p>Your privacy is important to us. This Privacy Policy explains how EverHack collects, uses, and protects your information when you use our platform.</p>
          <h2 className="text-xl font-semibold mt-6">Information We Collect</h2>
          <ul className="list-disc ml-6">
            <li>Personal information you provide during registration (name, email, etc.)</li>
            <li>Event participation and activity data</li>
            <li>Technical data such as IP address and browser type</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6">How We Use Your Information</h2>
          <ul className="list-disc ml-6">
            <li>To manage your account and event registrations</li>
            <li>To send notifications and updates</li>
            <li>To improve our platform and services</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6">Your Rights</h2>
          <ul className="list-disc ml-6">
            <li>You can request access, correction, or deletion of your data at any time.</li>
            <li>Contact us at privacy@everhack.com for any privacy concerns.</li>
          </ul>
        </div>
      </section>
      <Footer />
    </div>
  );
}
