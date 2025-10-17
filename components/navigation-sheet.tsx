"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, Moon, Sun, Wallet, Send, ArrowDown, MessageSquare, PlusCircle, Home, ArrowLeftRight, ImagePlus } from "lucide-react";
import { Logo } from "./logo";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const scrollToComponent = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
        window.scrollTo({
            top: middle,
            behavior: 'smooth'
        });
    }
};

export const NavigationSheet = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const sheetRef = useRef<HTMLButtonElement>(null);

    const handleNavigation = (id: string) => {
        scrollToComponent(id);
        // Simulate ESC key press to close the sheet
        if (sheetRef.current) {
            sheetRef.current.click();
        }
    };

    const pageLinks = [
        { href: '/', label: 'Home', icon: <Home className="mr-2 h-4 w-4" /> },
        { href: '/swap', label: 'Token Swap', icon: <ArrowLeftRight className="mr-2 h-4 w-4" /> },
        { href: '/nfts', label: 'NFT Studio', icon: <ImagePlus className="mr-2 h-4 w-4" /> },
    ];

    const navigationItems = [
        { id: 'showbalance', label: 'Show Balance', icon: <Wallet className="mr-2 h-4 w-4" /> },
        { id: 'sendtokens', label: 'Send Solana', icon: <Send className="mr-2 h-4 w-4" /> },
        { id: 'requestairdrop', label: 'Request Airdrop', icon: <ArrowDown className="mr-2 h-4 w-4" /> },
        { id: 'signmessage', label: 'Sign Message', icon: <MessageSquare className="mr-2 h-4 w-4" /> },
        { id: 'launchpad', label: 'Create Token', icon: <PlusCircle className="mr-2 h-4 w-4" /> },
        { id: 'tokenlist', label: 'My Tokens', icon: <Wallet className="mr-2 h-4 w-4" /> },
        { id: 'mintmore', label: 'Mint More', icon: <PlusCircle className="mr-2 h-4 w-4" /> },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button variant="outline" size="icon" className="rounded-full">
                        <Menu />
                    </Button>
                </motion.div>
            </SheetTrigger>
            <SheetContent className="p-6">
                <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <Logo textSize="2xl" />
                    <div className="flex flex-col gap-3 mt-6">
                        <motion.div
                            whileHover={{ x: 10 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="secondary"
                                onClick={toggleTheme}
                                className="w-full justify-start"
                            >
                                {isDarkMode ? (
                                    <>
                                        <Sun className="mr-2 h-4 w-4" />
                                        Light Mode
                                    </>
                                ) : (
                                    <>
                                        <Moon className="mr-2 h-4 w-4" />
                                        Dark Mode
                                    </>
                                )}
                            </Button>
                        </motion.div>

                        {/* Page Links */}
                        <div className="border-t pt-3 mt-2">
                            <p className="text-xs text-muted-foreground mb-2 px-3">Pages</p>
                            {pageLinks.map((link) => (
                                <motion.div
                                    key={link.href}
                                    whileHover={{ x: 10 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link href={link.href}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => sheetRef.current?.click()}
                                        >
                                            {link.icon}
                                            {link.label}
                                        </Button>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Scroll Navigation */}
                        <div className="border-t pt-3 mt-2">
                            <p className="text-xs text-muted-foreground mb-2 px-3">Components</p>
                            {navigationItems.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ x: 10 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => handleNavigation(item.id)}
                                >
                                    {item.icon}
                                    {item.label}
                                </Button>
                            </motion.div>
                        ))}
                        </div>
                    </div>
                </motion.div>
            </SheetContent>
            {/* Hidden button for closing the sheet */}
            <SheetClose ref={sheetRef} className="hidden" />
        </Sheet>
    );
};
