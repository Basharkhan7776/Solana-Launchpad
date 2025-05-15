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



function App() {

  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <ThemeProvider>
            <div className='h-full w-full flex flex-col font-roboto'>
              <Navbar />
              <div className='px-[16%] mt-28 min-h-screen flex flex-wrap items-start'>
                <Showbalance/>
                <SendTokens/>
                <RequestAirdrop/>
                <SignMessage/>
                <LaunchPad/>
              </div>
              <Footer />
            </div>
          </ThemeProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App