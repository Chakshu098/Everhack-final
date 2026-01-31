import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User, Bell, HelpCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";


const navLinks = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "Teams", path: "/teams" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export function Navbar({ adminMode = false }: { adminMode?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = () => {
    if (user?.full_name) {
      return user.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50"
    >
      <nav className="container-wide flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo (4).png" alt="EverHack" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        {!adminMode && (
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors duration-300 hover:text-primary ${location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                    }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* CTA Buttons / Profile */}
        {!adminMode && (
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border-2 border-primary/50">
                      <AvatarImage src={user.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.email} alt="Profile" />
                      <AvatarFallback className="bg-primary/20 text-primary">{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <User size={16} />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/notifications" className="flex items-center gap-2 cursor-pointer">
                      <Bell size={16} />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/faqs" className="flex items-center gap-2 cursor-pointer">
                      <HelpCircle size={16} />
                      FAQs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer text-destructive">
                    <LogOut size={16} />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/login?signup=true">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        )}

        {/* Mobile Menu Toggle */}
        {!adminMode && (
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </nav>

      {/* Mobile Menu */}
      {!adminMode && mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
        >
          <div className="container-wide py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-medium py-2 ${location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground"
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex gap-4 pt-4 border-t border-border">
              {user ? (
                <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link to="/login?signup=true">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
