import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <div className="font-display text-[10rem] font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
          404
        </div>
        <h1 className="font-display text-2xl font-semibold mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
          <Button asChild>
            <Link to="/">
              <Home size={16} className="mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
