import './App.css'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ThemeProvider } from '@/context/ThemeContext'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { RequestAirdrop } from '@/components/RequestAirdrop';
import { Showbalance } from '@/components/Showbalance';
import { SendTokens } from '@/components/SendTokens';
import SignMessage from './components/SignMessage';
import { LaunchPad } from './components/LaunchPad';
import { ConnectionNavbar } from './components/ConnectionNavbar';
import { useRpc } from './context/RpcContext';
import { Toaster } from "@/components/ui/sonner"
import { motion } from "framer-motion";

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

function App() {
  const { rpcUrl } = useRpc();

  return (
    <ConnectionProvider endpoint={rpcUrl}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <ThemeProvider>
            <div className='h-full w-full flex flex-col font-roboto'>
              <Navbar />
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
                    className='md:grid lg:grid-cols-3 md:grid-cols-2 flex flex-col gap-4'
                    variants={containerVariants}
                  >
                    <motion.div variants={itemVariants} id="showbalance"><Showbalance /></motion.div>
                    <motion.div variants={itemVariants} id="sendtokens"><SendTokens /></motion.div>
                    <motion.div variants={itemVariants} id="requestairdrop"><RequestAirdrop /></motion.div>
                    <motion.div variants={itemVariants} id="signmessage"><SignMessage /></motion.div>
                    <motion.div 
                        className='col-span-2' 
                        variants={itemVariants}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        id="launchpad"
                    >
                        <LaunchPad />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
              <Footer />
              <Toaster />
            </div>
          </ThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App