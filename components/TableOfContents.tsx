"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TocItem {
  id: string;
  label: string;
  icon?: string;
}

const tocItems: TocItem[] = [
  { id: "showbalance", label: "Show Balance" },
  { id: "sendtokens", label: "Send Tokens" },
  { id: "requestairdrop", label: "Request Airdrop" },
  { id: "signmessage", label: "Sign Message" },
  { id: "launchpad", label: "Launch Pad" },
  { id: "tokenlist", label: "Token List" },
  { id: "mintmore", label: "Mint More" },
];

export function TableOfContents() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed top-24 left-4 z-50">
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full shadow-lg bg-background hover:bg-accent"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Table of Contents Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-0 left-0 min-w-[250px]"
            onMouseLeave={() => setIsOpen(false)}
          >
            <Card className="p-4 shadow-xl border-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Contents</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="space-y-1">
                {tocItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors duration-150 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item.label}
                  </motion.button>
                ))}
              </nav>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
