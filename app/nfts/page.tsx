"use client";

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Toaster } from "@/components/ui/sonner";
import { motion } from "framer-motion";
import { NftMint } from '@/components/NftMint';
import { NftGallery } from '@/components/NftGallery';
import { NftCollection } from '@/components/NftCollection';
import { NftBulkMint } from '@/components/NftBulkMint';
import { ConnectionNavbar } from '@/components/ConnectionNavbar';
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

export default function NftsPage() {
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
          <motion.div variants={itemVariants}>
            <ConnectionNavbar />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="text-center mb-6"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              NFT Studio
            </h1>
            <p className="text-muted-foreground">
              Create, manage, and view your NFT collections
            </p>
          </motion.div>

          {/* Bento Grid Layout */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 auto-rows-[minmax(300px,auto)]"
            variants={containerVariants}
          >
            {/* NFT Collection - Takes 2 columns on large screens, full row on medium */}
            <motion.div
              className="md:col-span-2 lg:col-span-4 lg:row-span-2"
              variants={itemVariants}
              id="nftcollection"
            >
              <div className="h-full">
                <NftCollection />
              </div>
            </motion.div>

            {/* NFT Mint - Takes 2 columns on large screens, spans 2 rows */}
            <motion.div
              className="md:col-span-2 lg:col-span-2 lg:row-span-2"
              variants={itemVariants}
              id="nftmint"
            >
              <div className="h-full">
                <NftMint />
              </div>
            </motion.div>

            {/* NFT Gallery - Full width, taller card */}
            <motion.div
              className="md:col-span-2 lg:col-span-6 lg:row-span-2"
              variants={itemVariants}
              id="nftgallery"
            >
              <div className="h-full">
                <NftGallery />
              </div>
            </motion.div>

            {/* NFT Bulk Mint - Takes 4 columns on large screens */}
            <motion.div
              className="md:col-span-2 lg:col-span-4 lg:row-span-2"
              variants={itemVariants}
              id="nftbulkmint"
            >
              <div className="h-full">
                <NftBulkMint />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
