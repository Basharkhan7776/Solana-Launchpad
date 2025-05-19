
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@/components/wallet-multi-button";
import { WalletModalProvider } from "@/provider/wallet-model";
import { useRpc } from "@/context/RpcContext";

export const Wallet = () => {
const {rpcUrl} = useRpc();

  return (
    <ConnectionProvider endpoint={rpcUrl}>
      <WalletProvider wallets={[]} autoConnect={true}>
        <WalletModalProvider>
          <WalletMultiButton />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
