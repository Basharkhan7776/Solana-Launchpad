"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { RefreshCcw, Grid3x3, List, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
    mplTokenMetadata,
    fetchAllDigitalAssetByOwner,
    DigitalAsset
} from '@metaplex-foundation/mpl-token-metadata';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { publicKey } from '@metaplex-foundation/umi';

interface NftMetadata {
    name: string;
    symbol: string;
    description?: string;
    image?: string;
    external_url?: string;
    attributes?: Array<{ trait_type: string; value: string }>;
}

interface NftItem extends DigitalAsset {
    metadata?: NftMetadata;
}

export function NftGallery() {
    const { connected, publicKey: walletPublicKey } = useWallet();
    const { connection } = useConnection();
    const wallet = useWallet();
    const [nfts, setNfts] = useState<NftItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedNft, setSelectedNft] = useState<NftItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchNfts = async () => {
        if (!connected || !walletPublicKey) {
            toast.error("Please connect your wallet first");
            return;
        }

        try {
            setLoading(true);

            // Initialize Umi
            const umi = createUmi(connection.rpcEndpoint)
                .use(walletAdapterIdentity(wallet))
                .use(mplTokenMetadata());

            // Fetch all NFTs owned by the wallet
            const assets = await fetchAllDigitalAssetByOwner(
                umi,
                publicKey(walletPublicKey.toBase58())
            );

            console.log("Found NFTs:", assets.length);

            // Fetch metadata for each NFT
            const nftsWithMetadata = await Promise.all(
                assets.map(async (asset) => {
                    try {
                        if (asset.metadata.uri) {
                            const response = await fetch(asset.metadata.uri);
                            if (response.ok) {
                                const metadata: NftMetadata = await response.json();
                                return { ...asset, metadata };
                            }
                        }
                        return asset;
                    } catch (error) {
                        console.error("Error fetching metadata for NFT:", error);
                        return asset;
                    }
                })
            );

            setNfts(nftsWithMetadata);
            if (nftsWithMetadata.length === 0) {
                toast.info("No NFTs found in your wallet");
            } else {
                toast.success(`Found ${nftsWithMetadata.length} NFT${nftsWithMetadata.length > 1 ? 's' : ''}`);
            }
        } catch (error) {
            console.error("Error fetching NFTs:", error);
            if (error instanceof Error) {
                toast.error(`Failed to fetch NFTs: ${error.message}`);
            } else {
                toast.error("Failed to fetch NFTs. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (connected && walletPublicKey) {
            fetchNfts();
        } else {
            setNfts([]);
        }
    }, [connected, walletPublicKey]);

    const openNftDetails = (nft: NftItem) => {
        setSelectedNft(nft);
        setIsDialogOpen(true);
    };

    return (
        <>
            <Card className="w-full h-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>My NFTs</CardTitle>
                            <CardDescription>
                                View all NFTs you own
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                                disabled={!connected}
                            >
                                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={fetchNfts}
                                disabled={loading || !connected}
                            >
                                {loading ? <Spinner /> : <RefreshCcw className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {!connected ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Please connect your wallet to view NFTs
                        </div>
                    ) : loading ? (
                        <div className="flex justify-center items-center py-8">
                            <Spinner />
                        </div>
                    ) : nfts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No NFTs found. Create your first NFT!
                        </div>
                    ) : (
                        <div
                            className={
                                viewMode === "grid"
                                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2"
                                    : "flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2"
                            }
                        >
                            {nfts.map((nft, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                                    onClick={() => openNftDetails(nft)}
                                >
                                    {viewMode === "grid" ? (
                                        <div>
                                            <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                                                {nft.metadata?.image ? (
                                                    <img
                                                        src={nft.metadata.image}
                                                        alt={nft.metadata.name || "NFT"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-muted-foreground text-4xl">🖼️</div>
                                                )}
                                            </div>
                                            <div className="p-2">
                                                <h3 className="font-semibold text-sm truncate">
                                                    {nft.metadata?.name || nft.metadata.name}
                                                </h3>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {nft.metadata?.symbol || nft.metadata.symbol}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 p-3">
                                            <div className="w-16 h-16 rounded bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {nft.metadata?.image ? (
                                                    <img
                                                        src={nft.metadata.image}
                                                        alt={nft.metadata.name || "NFT"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-muted-foreground text-2xl">🖼️</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm truncate">
                                                    {nft.metadata?.name || nft.metadata.name}
                                                </h3>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {nft.metadata?.symbol || nft.metadata.symbol}
                                                </p>
                                                {nft.metadata?.description && (
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {nft.metadata.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* NFT Details Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedNft && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedNft.metadata?.name || selectedNft.metadata.name}</DialogTitle>
                                <DialogDescription>
                                    {selectedNft.metadata?.symbol || selectedNft.metadata.symbol}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                {/* Image */}
                                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                    {selectedNft.metadata?.image ? (
                                        <img
                                            src={selectedNft.metadata.image}
                                            alt={selectedNft.metadata.name || "NFT"}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-muted-foreground text-6xl">🖼️</div>
                                    )}
                                </div>

                                {/* Description */}
                                {selectedNft.metadata?.description && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Description</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedNft.metadata.description}
                                        </p>
                                    </div>
                                )}

                                {/* Attributes */}
                                {selectedNft.metadata?.attributes && selectedNft.metadata.attributes.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Attributes</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedNft.metadata.attributes.map((attr, idx) => (
                                                <div key={idx} className="border rounded p-2">
                                                    <p className="text-xs text-muted-foreground">{attr.trait_type}</p>
                                                    <p className="text-sm font-semibold">{attr.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Details */}
                                <div>
                                    <h4 className="font-semibold mb-2">Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Mint Address:</span>
                                            <span className="font-mono text-xs">{selectedNft.mint.publicKey.toString().slice(0, 16)}...</span>
                                        </div>
                                        {selectedNft.metadata?.external_url && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">External URL:</span>
                                                <a
                                                    href={selectedNft.metadata.external_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-primary hover:underline"
                                                >
                                                    Visit <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
