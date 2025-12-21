import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Box, Code, FileText, Coins, Search as SearchIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/ecosystem", label: "Ecosystem", icon: Box },
  { href: "/developers", label: "Developers", icon: Code },
  { href: "/doc-hub", label: "Doc Hub", icon: FileText },
  { href: "/token", label: "Token", icon: Coins },
  { href: "/explorer", label: "Explorer", icon: SearchIcon },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="hover:bg-white/5 min-w-[44px] min-h-[44px]"
        data-testid="button-mobile-menu"
      >
        <Menu className="w-6 h-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-background border-l border-white/10 z-50 p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-display font-bold text-xl">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <button
                        onClick={() => setIsOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </Link>
                  );
                })}
              </nav>

              <div className="absolute bottom-6 left-6 right-6">
                <Link href="/ecosystem">
                  <Button
                    className="w-full bg-primary text-background hover:bg-primary/90 font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Launch App
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
