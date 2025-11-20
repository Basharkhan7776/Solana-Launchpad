import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { LaunchpadIDL, LAUNCHPAD_PROGRAM_ID } from "./launchpad-idl";

export function getLaunchpadProgram(
  connection: Connection,
  wallet: AnchorWallet
): Program<LaunchpadIDL> {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  return new Program(
    {
      version: "0.1.0",
      name: "launchpad",
      instructions: [],
      accounts: [],
    } as any,
    LAUNCHPAD_PROGRAM_ID,
    provider
  );
}

export function getPresalePDA(
  authority: PublicKey,
  presaleId: string
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("presale"), authority.toBuffer(), Buffer.from(presaleId)],
    new PublicKey(LAUNCHPAD_PROGRAM_ID)
  );
}

export function getVaultPDA(presale: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), presale.toBuffer()],
    new PublicKey(LAUNCHPAD_PROGRAM_ID)
  );
}

export function getContributionPDA(
  presale: PublicKey,
  contributor: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("contribution"), presale.toBuffer(), contributor.toBuffer()],
    new PublicKey(LAUNCHPAD_PROGRAM_ID)
  );
}

export function getWhitelistPDA(
  presale: PublicKey,
  user: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("whitelist"), presale.toBuffer(), user.toBuffer()],
    new PublicKey(LAUNCHPAD_PROGRAM_ID)
  );
}

export interface PresaleData {
  authority: PublicKey;
  tokenMint: PublicKey;
  presaleVault: PublicKey;
  paymentMint: PublicKey;
  softCap: number;
  hardCap: number;
  minContribution: number;
  maxContribution: number;
  tokenPrice: number;
  tokensSold: number;
  totalRaised: number;
  startTime: number;
  endTime: number;
  vestingEnabled: boolean;
  vestingCliff: number;
  vestingDuration: number;
  isWhitelisted: boolean;
  isFinalized: boolean;
  isPaused: boolean;
  bump: number;
}

export interface ContributionData {
  presale: PublicKey;
  contributor: PublicKey;
  amountPaid: number;
  tokensAllocated: number;
  tokensClaimed: number;
  lastClaimTime: number;
  bump: number;
}

export function calculateProgress(totalRaised: number, hardCap: number): number {
  if (hardCap === 0) return 0;
  return Math.min((totalRaised / hardCap) * 100, 100);
}

export function formatTimeRemaining(endTime: number): string {
  const now = Math.floor(Date.now() / 1000);
  const remaining = endTime - now;

  if (remaining <= 0) return "Ended";

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function getPresaleStatus(
  presale: PresaleData
): "upcoming" | "active" | "ended" | "finalized" {
  const now = Math.floor(Date.now() / 1000);

  if (presale.isFinalized) return "finalized";
  if (now < presale.startTime) return "upcoming";
  if (now > presale.endTime) return "ended";
  return "active";
}

export function lamportsToSol(lamports: number): number {
  return lamports / 1e9;
}

export function solToLamports(sol: number): number {
  return Math.floor(sol * 1e9);
}
