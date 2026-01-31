import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const faqs = [
  {
    question: "What is EverHack?",
    answer: "EverHack is a platform for hosting and joining hackathons, CTFs, and tech workshops."
  },
  {
    question: "How do I register for an event?",
    answer: "Go to the event details page and click 'Register Now' to fill out the registration form."
  },
  {
    question: "Can I join as a team?",
    answer: "Yes, most events allow team registrations. Please check the event details for team size limits."
  },
  {
    question: "How do I get notifications?",
    answer: "Enable notifications in your profile or check the Notifications page for updates."
  },
  {
    question: "Where can I find the rules and policies?",
    answer: "See the Privacy Policy, Terms of Service, and Code of Conduct pages for all legal and community guidelines."
  }
];

export default function FAQs() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container-wide pt-32 pb-16">
        <h1 className="font-display text-4xl font-bold mb-8">Frequently Asked Questions</h1>
        <div className="space-y-8">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-card rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold mb-2">{faq.question}</h2>
              <p className="text-muted-foreground text-base">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
