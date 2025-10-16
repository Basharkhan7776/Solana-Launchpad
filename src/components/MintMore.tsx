"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { CirclePlus, ChevronDown, Coins } from "lucide-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_2022_PROGRAM_ID, createMintToInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TokenMint {
    mint: string;
    name: string;
    symbol: string;
    image?: string;
}

export function MintMore() {
    const [selectedMint, setSelectedMint] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [tokenMints, setTokenMints] = useState<TokenMint[]>([]);
    const { connection } = useConnection();
    const [loading, setLoading] = useState(false);
    const [fetchingTokens, setFetchingTokens] = useState(false);
    const wallet = useWallet();

    const fetchUserTokenMints = async () => {
        if (!wallet.connected || !wallet.publicKey) {
            return;
        }

        try {
            setFetchingTokens(true);

            // Get all token accounts owned by the wallet for TOKEN_2022_PROGRAM_ID
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                wallet.publicKey,
                { programId: TOKEN_2022_PROGRAM_ID }
            );

            const mints: TokenMint[] = [];

            for (const accountInfo of tokenAccounts.value) {
                const parsedInfo = accountInfo.account.data.parsed.info;
                const mint = parsedInfo.mint;

                try {
                    const mintPubkey = new PublicKey(mint);
                    const mintInfo = await connection.getParsedAccountInfo(mintPubkey);

                    if (mintInfo.value && 'parsed' in mintInfo.value.data) {
                        const mintData = mintInfo.value.data.parsed.info;

                        // Check if user is the mint authority
                        if (mintData.mintAuthority === wallet.publicKey.toBase58()) {
                            // Try to fetch metadata
                            let name = mint.slice(0, 8) + "...";
                            let symbol = mint.slice(0, 4);
                            let image = "";

                            // In production, parse metadata properly
                            // This is a placeholder for now

                            mints.push({
                                mint,
                                name,
                                symbol,
                                image
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error checking mint authority for", mint, error);
                }
            }

            setTokenMints(mints);
            if (mints.length === 0) {
                toast.info("No tokens found where you are the mint authority");
            }
        } catch (error) {
            console.error("Error fetching token mints:", error);
        } finally {
            setFetchingTokens(false);
        }
    };

    useEffect(() => {
        if (wallet.connected && wallet.publicKey) {
            fetchUserTokenMints();
        } else {
            setTokenMints([]);
            setSelectedMint("");
        }
    }, [wallet.connected, wallet.publicKey]);

    const validateInputs = () => {
        if (!wallet.connected) {
            toast.error("Please connect your wallet first");
            return false;
        }
        if (!wallet.publicKey) {
            toast.error("Wallet public key is not available");
            return false;
        }
        if (!selectedMint) {
            toast.error("Please select a token mint");
            return false;
        }
        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            toast.error("Please enter a valid amount");
            return false;
        }
        return true;
    };

    const handleMint = async () => {
        if (!validateInputs() || !wallet.publicKey) return;

        try {
            setLoading(true);

            const mintPubkey = new PublicKey(selectedMint);
            const associatedToken = getAssociatedTokenAddressSync(
                mintPubkey,
                wallet.publicKey,
                false,
                TOKEN_2022_PROGRAM_ID
            );

            const numAmount = parseFloat(amount);
            const mintToTx = new Transaction().add(
                createMintToInstruction(
                    mintPubkey,
                    associatedToken,
                    wallet.publicKey,
                    numAmount * 10 ** 9,
                    [],
                    TOKEN_2022_PROGRAM_ID
                )
            );

            const signature = await wallet.sendTransaction(mintToTx, connection);
            await connection.confirmTransaction(signature);

            toast.success(`Successfully minted ${numAmount} tokens!`);
            setAmount("");
            setSelectedMint("");
        } catch (error) {
            console.error("Error minting tokens:", error);
            if (error instanceof Error) {
                toast.error(`Failed to mint tokens: ${error.message}`);
            } else {
                toast.error("Failed to mint tokens. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full h-full flex flex-col justify-between">
            <CardHeader>
                <CardTitle>Mint Additional Tokens</CardTitle>
                <CardDescription>
                    Select an existing token and mint more supply. You must be the mint authority.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleMint(); }}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="mint">Select Token Mint</Label>
                            {fetchingTokens ? (
                                <div className="flex items-center justify-center h-10">
                                    <Spinner />
                                </div>
                            ) : tokenMints.length === 0 ? (
                                <div className="text-sm text-muted-foreground py-2">
                                    {wallet.connected
                                        ? "No tokens found where you are the mint authority"
                                        : "Connect wallet to view your tokens"}
                                </div>
                            ) : (
                                <Select
                                    value={selectedMint}
                                    onValueChange={setSelectedMint}
                                    disabled={loading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a token mint">
                                            {selectedMint && tokenMints.find(t => t.mint === selectedMint) && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                        {tokenMints.find(t => t.mint === selectedMint)?.image ? (
                                                            <img
                                                                src={tokenMints.find(t => t.mint === selectedMint)?.image}
                                                                alt="Token"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Coins className="h-3 w-3 text-primary" />
                                                        )}
                                                    </div>
                                                    <span>{tokenMints.find(t => t.mint === selectedMint)?.name}</span>
                                                </div>
                                            )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tokenMints.map((token) => (
                                            <SelectItem key={token.mint} value={token.mint}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                        {token.image ? (
                                                            <img
                                                                src={token.image}
                                                                alt={token.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Coins className="h-4 w-4 text-primary" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{token.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {token.symbol} • {token.mint.slice(0, 4)}...{token.mint.slice(-4)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            <Label htmlFor="amount">Enter the amount to mint</Label>
                            <Input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter the amount"
                                min={0}
                                step={0.1}
                                disabled={loading || tokenMints.length === 0}
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={handleMint}
                    disabled={loading || tokenMints.length === 0 || !wallet.connected}
                >
                    {!loading ? <><CirclePlus /> Mint Tokens</> : <Spinner />}
                </Button>
            </CardFooter>
        </Card>
    );
}
