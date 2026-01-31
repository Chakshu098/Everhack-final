import { Link } from "react-router-dom";


const footerLinks = {
  platform: [
    { name: "Events", path: "/events" },
    { name: "Hackathons", path: "/events?type=hackathon" },
    { name: "CTFs", path: "/events?type=ctf" },
    { name: "Workshops", path: "/events?type=workshop" },
  ],
  company: [
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Careers", path: "/careers" },
    { name: "Press", path: "/press" },
  ],
  legal: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Code of Conduct", path: "/conduct" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img src="/logo (4).png" alt="EverHack" className="h-12 w-auto" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              We initiate the innovations. The premier platform for tech communities to host and launch hackathons, CTFs, and workshops.
            </p>
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} EverHack. All rights reserved.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
