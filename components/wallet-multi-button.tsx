"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, LogOut } from "lucide-react";
import { WalletIcon } from "@/components/wallet-icon";
import { useWalletModal } from "@/hooks/use-wallet-model";
import { useAppDispatch } from "@/store/hooks";
import { setWalletAddress, disconnectWallet as disconnectWalletRedux } from "@/store/walletSlice";

interface WalletMultiButtonProps {
  labels?: {
    "copy-address": string;
    copied: string;
    "change-wallet": string;
    disconnect: string;
    connecting: string;
    connected: string;
    "has-wallet": string;
    "no-wallet": string;
  };
}

export function WalletMultiButton({
  labels = {
    "copy-address": "Copy address",
    copied: "Copied",
    "change-wallet": "Change wallet",
    disconnect: "Disconnect",
    connecting: "Connecting...",
    connected: "Connected",
    "has-wallet": "Connect",
    "no-wallet": "Connect Wallet",
  },
}: WalletMultiButtonProps) {
  const { publicKey, wallet, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [walletSelected, setWalletSelected] = useState(false);

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const content = useMemo(() => {
    if (connecting) return labels["connecting"];
    if (wallet)
      return base58
        ? `${base58.slice(0, 4)}...${base58.slice(-4)}`
        : labels["connected"];
    return labels["no-wallet"];
  }, [connecting, wallet, base58, labels]);

  const copyAddress = async () => {
    if (base58) {
      try {
        await navigator.clipboard.writeText(base58);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const openModal = () => {
    setVisible(true);
    setDropdownOpen(false);
    setWalletSelected(true);
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      dispatch(disconnectWalletRedux());
      setDropdownOpen(false);
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  // Sync wallet connection with Redux
  useEffect(() => {
    if (publicKey) {
      dispatch(setWalletAddress(publicKey.toBase58()));
    } else {
      dispatch(disconnectWalletRedux());
    }
  }, [publicKey, dispatch]);

  // Reset wallet selection state after connection
  useEffect(() => {
    if (wallet && publicKey && walletSelected) {
      setWalletSelected(false);
    }
  }, [wallet, publicKey, walletSelected]);

  if (!wallet) {
    return (
      <Button 
        onClick={openModal}
        className="bg-primary hover:bg-primary/90"
      >
        {content}
      </Button>
    );
  }

  return (
    <div ref={ref}>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            className="gap-2 bg-primary hover:bg-primary/90"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {wallet.adapter.icon && (
              <WalletIcon
                wallet={{
                  icon: wallet.adapter.icon,
                  name: wallet.adapter.name,
                }}
              />
            )}
            {content}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {base58 && (
            <DropdownMenuItem 
              onClick={copyAddress}
              className="cursor-pointer hover:bg-accent"
            >
              <Copy className="mr-2 h-4 w-4" />
              <span>{copied ? labels["copied"] : labels["copy-address"]}</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={disconnectWallet}
            className="cursor-pointer hover:bg-accent"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{labels["disconnect"]}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
