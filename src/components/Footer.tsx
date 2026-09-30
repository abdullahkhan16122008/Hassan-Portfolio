import { motion } from "framer-motion";
import { Heart, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative py-12 border-t border-border">
      <div className="container-width section-padding">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-sm flex items-center gap-1"
          >
            © {new Date().getFullYear()} Hasan Ansari. Built with{" "}
            <Heart className="h-4 w-4 text-destructive fill-current" /> using React & Tailwind
          </motion.p>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6"
          >
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToTop}
              className="rounded-full"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
