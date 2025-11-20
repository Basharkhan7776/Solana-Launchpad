import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { PresaleData, getPresaleStatus } from "@/lib/anchor/launchpad";

export interface PresaleWithKey extends PresaleData {
  publicKey: PublicKey;
}

export function useLaunchpad() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [presales, setPresales] = useState<PresaleWithKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPresales();
  }, [connection]);

  const fetchPresales = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement fetching presales from the blockchain
      // This would involve getting all presale accounts from the program
      // For now, returning empty array as placeholder

      setPresales([]);
    } catch (err) {
      console.error("Error fetching presales:", err);
      setError("Failed to fetch presales");
    } finally {
      setLoading(false);
    }
  };

  const getActivePresales = () => {
    return presales.filter(
      (presale) => getPresaleStatus(presale) === "active"
    );
  };

  const getUpcomingPresales = () => {
    return presales.filter(
      (presale) => getPresaleStatus(presale) === "upcoming"
    );
  };

  const getEndedPresales = () => {
    return presales.filter((presale) => {
      const status = getPresaleStatus(presale);
      return status === "ended" || status === "finalized";
    });
  };

  return {
    presales,
    loading,
    error,
    refresh: fetchPresales,
    getActivePresales,
    getUpcomingPresales,
    getEndedPresales,
  };
}
