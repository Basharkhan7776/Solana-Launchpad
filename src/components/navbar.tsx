import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavigationSheet } from "./navigation-sheet";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <motion.div 
      className="bg-muted z-10"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.5
      }}
    >
      <nav className="fixed top-4 inset-x-4 h-16 bg-primary-foreground border shadow max-w-screen-xl mx-auto rounded-xl">
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Logo />
          </motion.div>
          <div>
            {/* Desktop Menu */}
            
          </div>
          <motion.div 
            className="flex items-center gap-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Theme mode toggle*/}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={"secondary"}
                className="hidden md:block"
                onClick={toggleTheme}
              >
                {isDarkMode ? <Sun /> : <Moon />}
              </Button>
            </motion.div>
            {/* Mobile Menu */}
            <motion.div 
              className="md:hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <NavigationSheet />
            </motion.div>
          </motion.div>
        </div>
      </nav>
    </motion.div>
  );
};

export default Navbar;
