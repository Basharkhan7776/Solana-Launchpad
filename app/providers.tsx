"use client";

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider as SolanaWalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletModalProvider } from '@/provider/wallet-model';
import { ThemeProvider } from '@/context/ThemeContext';
import { RpcProvider, useRpc } from '@/context/RpcContext';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import '@solana/wallet-adapter-react-ui/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <RpcProvider>
        <AppProviders>{children}</AppProviders>
      </RpcProvider>
    </Provider>
  );
}

function AppProviders({ children }: { children: React.ReactNode }) {
  const { rpcUrl } = useRpc();

  return (
    <ConnectionProvider endpoint={rpcUrl}>
      <WalletProvider wallets={[]} autoConnect>
        <SolanaWalletModalProvider>
          <WalletModalProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </WalletModalProvider>
        </SolanaWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
