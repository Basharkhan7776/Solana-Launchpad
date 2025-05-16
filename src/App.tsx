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



function App() {

  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <ThemeProvider>
            <div className='h-full w-full flex flex-col font-roboto'>
              <Navbar />
              <div className='lg:mt-4 mt-24 px-4 min-h-screen flex flex-wrap items-center justify-center'>
                <div className=' md:w-[1280px] w-full flex flex-col gap-4 justify-center'>
                  <div>
                    <ConnectionNavbar />
                  </div>
                  <div className='md:grid lg:grid-cols-3 md:grid-cols-2 flex flex-col gap-4'>
                    <div><Showbalance /></div>
                    <div><SendTokens /></div>
                    <div><RequestAirdrop /></div>
                    <div><SignMessage /></div>
                    <div className='col-span-2'><LaunchPad /></div>
                  </div>
                </div>
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