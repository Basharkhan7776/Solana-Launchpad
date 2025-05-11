import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { Logo } from "./logo";
import { useTheme } from "@/context/ThemeContext";

export const NavigationSheet = () => {
    const { isDarkMode, toggleTheme } = useTheme();


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-6">
        <Logo textSize="2xl" />
        <div className="flex flex-col gap-3">
        <Button
              variant={"secondary"}
              onClick={toggleTheme}
            >
              {isDarkMode ? <Sun /> : <Moon />}
            </Button>
          <Button variant={"secondary"}><a href="#">Home</a></Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
