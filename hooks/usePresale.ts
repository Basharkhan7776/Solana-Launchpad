import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "sonner";
import {
  PresaleData,
  ContributionData,
  getPresalePDA,
  getContributionPDA,
  solToLamports,
  lamportsToSol,
} from "@/lib/anchor/launchpad";

export function usePresale(presaleAddress: string) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [presale, setPresale] = useState<PresaleData | null>(null);
  const [contribution, setContribution] = useState<ContributionData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [contributing, setContributing] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (presaleAddress) {
      fetchPresaleData();
    }
  }, [presaleAddress, wallet.publicKey]);

  const fetchPresaleData = async () => {
    try {
      setLoading(true);

      // TODO: Fetch presale account data
      // const presalePubkey = new PublicKey(presaleAddress);
      // const accountInfo = await connection.getAccountInfo(presalePubkey);
      // Parse and set presale data

      // TODO: Fetch contribution data if wallet is connected
      // if (wallet.publicKey) {
      //   const [contributionPDA] = getContributionPDA(presalePubkey, wallet.publicKey);
      //   const contributionInfo = await connection.getAccountInfo(contributionPDA);
      //   Parse and set contribution data
      // }
    } catch (err) {
      console.error("Error fetching presale data:", err);
      toast.error("Failed to load presale data");
    } finally {
      setLoading(false);
    }
  };

  const contribute = async (amount: number) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setContributing(true);

      // TODO: Build and send contribute transaction
      // const program = getLaunchpadProgram(connection, wallet);
      // const presalePubkey = new PublicKey(presaleAddress);
      // const [contributionPDA] = getContributionPDA(presalePubkey, wallet.publicKey);

      // const tx = await program.methods
      //   .contribute(new BN(solToLamports(amount)))
      //   .accounts({
      //     presale: presalePubkey,
      //     contribution: contributionPDA,
      //     contributor: wallet.publicKey,
      //     treasury: presale!.authority,
      //     systemProgram: SystemProgram.programId,
      //   })
      //   .rpc();

      toast.success(`Successfully contributed ${amount} SOL!`);
      await fetchPresaleData();
    } catch (err: any) {
      console.error("Error contributing:", err);
      toast.error(err.message || "Failed to contribute");
    } finally {
      setContributing(false);
    }
  };

  const claimTokens = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setClaiming(true);

      // TODO: Build and send claim transaction
      // const program = getLaunchpadProgram(connection, wallet);
      // const presalePubkey = new PublicKey(presaleAddress);
      // const [contributionPDA] = getContributionPDA(presalePubkey, wallet.publicKey);
      // const [vaultPDA] = getVaultPDA(presalePubkey);

      // Get or create token account
      // const contributorTokenAccount = await getAssociatedTokenAddress(
      //   presale!.tokenMint,
      //   wallet.publicKey
      // );

      // const tx = await program.methods
      //   .claimTokens()
      //   .accounts({
      //     presale: presalePubkey,
      //     contribution: contributionPDA,
      //     presaleVault: vaultPDA,
      //     contributorTokenAccount,
      //     contributor: wallet.publicKey,
      //   })
      //   .rpc();

      toast.success("Successfully claimed tokens!");
      await fetchPresaleData();
    } catch (err: any) {
      console.error("Error claiming tokens:", err);
      toast.error(err.message || "Failed to claim tokens");
    } finally {
      setClaiming(false);
    }
  };

  const getClaimableAmount = (): number => {
    if (!presale || !contribution) return 0;

    if (!presale.vestingEnabled) {
      return contribution.tokensAllocated - contribution.tokensClaimed;
    }

    // Calculate vested amount based on time
    const now = Math.floor(Date.now() / 1000);
    const cliffEnd = presale.endTime + presale.vestingCliff;

    if (now < cliffEnd) return 0;

    const vestingEnd = presale.endTime + presale.vestingDuration;
    if (now >= vestingEnd) {
      return contribution.tokensAllocated - contribution.tokensClaimed;
    }

    // Linear vesting
    const timeSinceEnd = now - presale.endTime;
    const vestedPercentage = timeSinceEnd / presale.vestingDuration;
    const vested = contribution.tokensAllocated * vestedPercentage;

    return Math.max(0, vested - contribution.tokensClaimed);
  };

  return {
    presale,
    contribution,
    loading,
    contributing,
    claiming,
    contribute,
    claimTokens,
    getClaimableAmount,
    refresh: fetchPresaleData,
  };
}
