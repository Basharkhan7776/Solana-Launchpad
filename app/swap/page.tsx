"use client";

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Toaster } from "@/components/ui/sonner";
import { motion } from "framer-motion";
import { SwapInterface } from '@/components/swap/SwapInterface';
import { TableOfContents } from '@/components/TableOfContents';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function SwapPage() {
  return (
    <div className='h-full w-full flex flex-col font-roboto'>
      <Navbar />
      <TableOfContents />
      <div className='px-4 min-h-screen flex flex-wrap justify-center'>
        <motion.div
          className='mt-[90px] md:w-[1280px] w-full flex flex-col gap-4'
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-6"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Token Swap
            </h1>
            <p className="text-muted-foreground">
              Swap tokens at the best rates powered by Jupiter Aggregator
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <SwapInterface />
          </motion.div>
        </motion.div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
