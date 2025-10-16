"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { Coins, RefreshCcw, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";

interface TokenAccount {
    mint: string;
    balance: string;
    decimals: number;
    name?: string;
    symbol?: string;
    image?: string;
}

interface HoveredToken {
    mint: string;
    copied: boolean;
}

export function TokenList() {
    const { connected, publicKey } = useWallet();
    const { connection } = useConnection();
    const [tokens, setTokens] = useState<TokenAccount[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hoveredToken, setHoveredToken] = useState<string | null>(null);
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

    const fetchTokens = async () => {
        if (!connected || !publicKey) {
            toast.error("Please connect your wallet first");
            return;
        }

        try {
            setLoading(true);

            // Get all token accounts owned by the wallet for TOKEN_2022_PROGRAM_ID
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                publicKey,
                { programId: TOKEN_2022_PROGRAM_ID }
            );

            const tokenList: TokenAccount[] = [];

            for (const accountInfo of tokenAccounts.value) {
                const parsedInfo = accountInfo.account.data.parsed.info;
                const mint = parsedInfo.mint;
                const balance = parsedInfo.tokenAmount.uiAmountString;
                const decimals = parsedInfo.tokenAmount.decimals;

                // Skip if balance is 0
                if (parseFloat(balance) === 0) continue;

                // Try to fetch metadata
                try {
                    const mintPubkey = new PublicKey(mint);
                    const accountInfo = await connection.getAccountInfo(mintPubkey);

                    let name = "Unknown Token";
                    let symbol = "???";
                    let image = "";

                    // Parse metadata from account if available
                    if (accountInfo?.data) {
                        // This is a simplified metadata extraction
                        // In production, you'd use proper metadata parsing
                        const dataString = accountInfo.data.toString();

                        // Try to extract basic info (this is a placeholder)
                        name = mint.slice(0, 8) + "...";
                        symbol = mint.slice(0, 4);
                    }

                    tokenList.push({
                        mint,
                        balance,
                        decimals,
                        name,
                        symbol,
                        image
                    });
                } catch (error) {
                    console.error("Error fetching metadata for", mint, error);
                    tokenList.push({
                        mint,
                        balance,
                        decimals,
                        name: mint.slice(0, 8) + "...",
                        symbol: mint.slice(0, 4)
                    });
                }
            }

            setTokens(tokenList);
            if (tokenList.length === 0) {
                toast.info("No tokens found in your wallet");
            } else {
                toast.success(`Found ${tokenList.length} token${tokenList.length > 1 ? 's' : ''}`);
            }
        } catch (error) {
            console.error("Error fetching tokens:", error);
            if (error instanceof Error) {
                toast.error(`Failed to fetch tokens: ${error.message}`);
            } else {
                toast.error("Failed to fetch tokens. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (connected && publicKey) {
            fetchTokens();
        } else {
            setTokens([]);
        }
    }, [connected, publicKey]);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedAddress(text);
            toast.success("Address copied to clipboard");
            setTimeout(() => setCopiedAddress(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error("Failed to copy address");
        }
    };

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>My Tokens</CardTitle>
                        <CardDescription>
                            View all tokens you've created and own
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchTokens}
                        disabled={loading || !connected}
                    >
                        {loading ? <Spinner /> : <RefreshCcw className="h-4 w-4" />}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {!connected ? (
                    <div className="text-center py-8 text-muted-foreground">
                        Please connect your wallet to view tokens
                    </div>
                ) : loading ? (
                    <div className="flex justify-center items-center py-8">
                        <Spinner />
                    </div>
                ) : tokens.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No tokens found. Create your first token!
                    </div>
                ) : (
                    <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
                        {tokens.map((token, index) => (
                            <div
                                key={index}
                                className="relative group"
                                onMouseEnter={() => setHoveredToken(token.mint)}
                                onMouseLeave={() => setHoveredToken(null)}
                            >
                                {/* Main token card */}
                                <div className="border rounded-lg p-3 hover:bg-accent transition-all duration-200 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        {/* Token Image */}
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {token.image ? (
                                                <img
                                                    src={token.image}
                                                    alt={token.name || "Token"}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Coins className="h-5 w-5 text-primary" />
                                            )}
                                        </div>

                                        {/* Token Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-sm truncate">
                                                    {token.name || "Unknown Token"}
                                                </h3>
                                                <p className="text-sm font-bold">
                                                    {parseFloat(token.balance).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-muted-foreground">
                                                    {token.symbol || "???"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover overlay with details */}
                                {hoveredToken === token.mint && (
                                    <div className="absolute inset-0 bg-card border-2 border-primary rounded-lg p-3 shadow-lg z-10 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <div className="flex flex-col h-full justify-between">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                        {token.image ? (
                                                            <img
                                                                src={token.image}
                                                                alt={token.name || "Token"}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Coins className="h-5 w-5 text-primary" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-sm truncate">
                                                            {token.name || "Unknown Token"}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground">
                                                            {token.symbol || "???"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-1 text-xs">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Balance:</span>
                                                        <span className="font-semibold">{parseFloat(token.balance).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Decimals:</span>
                                                        <span className="font-semibold">{token.decimals}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mint Address with Copy Button */}
                                            <div className="mt-2 pt-2 border-t">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-muted-foreground">Mint Address:</p>
                                                        <p className="text-xs font-mono truncate">{token.mint}</p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            copyToClipboard(token.mint);
                                                        }}
                                                    >
                                                        {copiedAddress === token.mint ? (
                                                            <Check className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
