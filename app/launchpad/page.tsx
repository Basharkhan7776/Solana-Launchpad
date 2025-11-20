"use client";

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Toaster } from "@/components/ui/sonner";
import { motion } from "framer-motion";
import { TableOfContents } from '@/components/TableOfContents';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PresaleCard } from '@/components/launchpad/PresaleCard';
import { useLaunchpad } from '@/hooks/useLaunchpad';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, Plus, Rocket } from 'lucide-react';
import Link from 'next/link';

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

export default function LaunchpadPage() {
  const {
    presales,
    loading,
    error,
    getActivePresales,
    getUpcomingPresales,
    getEndedPresales,
  } = useLaunchpad();

  const activePresales = getActivePresales();
  const upcomingPresales = getUpcomingPresales();
  const endedPresales = getEndedPresales();

  return (
    <div className='h-full w-full flex flex-col font-roboto'>
      <Navbar />
      <TableOfContents />
      <div className='px-4 min-h-screen flex flex-wrap justify-center'>
        <motion.div
          className='mt-[90px] md:w-[1280px] w-full flex flex-col gap-6'
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Rocket className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Token Launchpad
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Participate in exclusive token presales and ICOs. Get early access to the next generation of Solana projects.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/launchpad/create">
                <Button size="lg" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Presale
                </Button>
              </Link>
              <Link href="/launchpad/my-contributions">
                <Button size="lg" variant="outline">
                  My Contributions
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
              <p className="text-sm text-muted-foreground mb-1">Active Presales</p>
              <p className="text-3xl font-bold">{activePresales.length}</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
              <p className="text-sm text-muted-foreground mb-1">Upcoming</p>
              <p className="text-3xl font-bold">{upcomingPresales.length}</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg border border-purple-500/20">
              <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
              <p className="text-3xl font-bold">{presales.length}</p>
            </div>
          </motion.div>

          {/* Presales List */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">
                  Active ({activePresales.length})
                </TabsTrigger>
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingPresales.length})
                </TabsTrigger>
                <TabsTrigger value="ended">
                  Ended ({endedPresales.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Spinner />
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <AlertCircle className="w-12 h-12 text-destructive" />
                    <p className="text-muted-foreground">{error}</p>
                  </div>
                ) : activePresales.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No active presales at the moment</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activePresales.map((presale) => (
                      <PresaleCard key={presale.publicKey.toBase58()} presale={presale} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upcoming" className="mt-6">
                {upcomingPresales.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No upcoming presales</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingPresales.map((presale) => (
                      <PresaleCard key={presale.publicKey.toBase58()} presale={presale} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ended" className="mt-6">
                {endedPresales.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No ended presales</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {endedPresales.map((presale) => (
                      <PresaleCard key={presale.publicKey.toBase58()} presale={presale} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
