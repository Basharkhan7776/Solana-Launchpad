import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavigationSheet } from "./navigation-sheet";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";


const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div className="bg-muted z-10">
      <nav className="fixed top-4 inset-x-4 h-16 bg-primary-foreground border shadow max-w-screen-xl mx-auto rounded-xl">
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <Logo />
          <div>
            {/* Desktop Menu */}
            
          </div>
          <div className="flex items-center gap-3">
            
            {/* Theme mode toggel*/}
            <Button
              variant={"secondary"}
              className="hidden md:block"
              onClick={toggleTheme}
            >
              {isDarkMode ? <Sun /> : <Moon />}
            </Button>
            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
