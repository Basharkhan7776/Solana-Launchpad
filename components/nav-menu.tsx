"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { Home, ArrowLeftRight, ImagePlus } from "lucide-react";

export const NavMenu = (props: NavigationMenuProps) => (
  <TooltipProvider delayDuration={100}>
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-2 space-x-0 data-[orientation=vertical]:flex-col  data-[orientation=vertical]:items-start">
        <NavigationMenuItem>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavigationMenuLink asChild>
                <Link href="/" className="flex items-center justify-center p-2 hover:bg-accent/20 rounded-md transition-all hover:scale-105">
                  <Home className="h-5 w-5" />
                </Link>
              </NavigationMenuLink>
            </TooltipTrigger>
            <TooltipContent>
              <p>Home</p>
            </TooltipContent>
          </Tooltip>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavigationMenuLink asChild>
                <Link href="/swap" className="flex items-center justify-center p-2 hover:bg-accent/20 rounded-md transition-all hover:scale-105">
                  <ArrowLeftRight className="h-5 w-5" />
                </Link>
              </NavigationMenuLink>
            </TooltipTrigger>
            <TooltipContent>
              <p>Token Swap</p>
            </TooltipContent>
          </Tooltip>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavigationMenuLink asChild>
                <Link href="/nfts" className="flex items-center justify-center p-2 hover:bg-accent/20 rounded-md transition-all hover:scale-105">
                  <ImagePlus className="h-5 w-5" />
                </Link>
              </NavigationMenuLink>
            </TooltipTrigger>
            <TooltipContent>
              <p>NFT Studio</p>
            </TooltipContent>
          </Tooltip>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </TooltipProvider>
);
