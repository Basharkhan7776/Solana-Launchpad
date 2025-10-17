"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Layers, Upload, X } from "lucide-react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
    createNft,
    mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata';
import {
    generateSigner,
    percentAmount,
    publicKey as umiPublicKey,
} from '@metaplex-foundation/umi';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

interface BulkNftItem {
    name: string;
    description: string;
    image: File | null;
    attributes: Array<{ trait_type: string; value: string }>;
}

export function NftBulkMint() {
    const [collectionMint, setCollectionMint] = useState<string>("");
    const [royaltyPercent, setRoyaltyPercent] = useState<string>("5");
    const [nftItems, setNftItems] = useState<BulkNftItem[]>([
        { name: "", description: "", image: null, attributes: [] }
    ]);
    const { connection } = useConnection();
    const [loading, setLoading] = useState(false);
    const [mintingProgress, setMintingProgress] = useState({ current: 0, total: 0 });
    const wallet = useWallet();

    const addNftItem = () => {
        setNftItems([...nftItems, { name: "", description: "", image: null, attributes: [] }]);
    };

    const removeNftItem = (index: number) => {
        setNftItems(nftItems.filter((_, i) => i !== index));
    };

    const updateNftItem = (index: number, field: keyof BulkNftItem, value: any) => {
        const updated = [...nftItems];
        updated[index] = { ...updated[index], [field]: value };
        setNftItems(updated);
    };

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            updateNftItem(index, 'image', e.target.files[0]);
        }
    };

    const validateInputs = () => {
        if (!wallet.connected) {
            toast.error("Please connect your wallet first");
            return false;
        }
        if (!wallet.publicKey) {
            toast.error("Wallet public key is not available");
            return false;
        }
        if (nftItems.length === 0) {
            toast.error("Please add at least one NFT to mint");
            return false;
        }
        for (let i = 0; i < nftItems.length; i++) {
            const item = nftItems[i];
            if (!item.name.trim()) {
                toast.error(`NFT #${i + 1}: Please enter a name`);
                return false;
            }
            if (!item.description.trim()) {
                toast.error(`NFT #${i + 1}: Please enter a description`);
                return false;
            }
            if (!item.image) {
                toast.error(`NFT #${i + 1}: Please upload an image`);
                return false;
            }
        }
        const royalty = parseFloat(royaltyPercent);
        if (isNaN(royalty) || royalty < 0 || royalty > 100) {
            toast.error("Royalty must be between 0 and 100");
            return false;
        }
        return true;
    };

    const handleBulkMint = async () => {
        if (!validateInputs() || !wallet.publicKey) return;

        try {
            setLoading(true);
            setMintingProgress({ current: 0, total: nftItems.length });

            // Initialize Umi
            const umi = createUmi(connection.rpcEndpoint)
                .use(walletAdapterIdentity(wallet))
                .use(mplTokenMetadata());

            const royalty = parseFloat(royaltyPercent);
            const collection = collectionMint.trim() ? umiPublicKey(collectionMint.trim()) : undefined;

            // Mint each NFT
            for (let i = 0; i < nftItems.length; i++) {
                const item = nftItems[i];
                setMintingProgress({ current: i + 1, total: nftItems.length });
                toast.info(`Minting NFT ${i + 1} of ${nftItems.length}...`);

                // Upload image
                const imageFormData = new FormData();
                imageFormData.append('file', item.image!, `bulk-nft-${i}.png`);

                const imageUploadResponse = await fetch('/api/upload/image', {
                    method: 'POST',
                    body: imageFormData,
                });

                if (!imageUploadResponse.ok) {
                    throw new Error(`Failed to upload image for NFT #${i + 1}`);
                }

                const { url: imageUri } = await imageUploadResponse.json();

                // Create metadata
                const metadata = {
                    name: item.name.trim(),
                    description: item.description.trim(),
                    image: imageUri,
                    attributes: item.attributes,
                    properties: {
                        files: [
                            {
                                uri: imageUri,
                                type: item.image!.type,
                            },
                        ],
                        category: "image",
                    },
                };

                // Upload metadata
                const metadataUploadResponse = await fetch('/api/upload/metadata', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ metadata }),
                });

                if (!metadataUploadResponse.ok) {
                    throw new Error(`Failed to upload metadata for NFT #${i + 1}`);
                }

                const { uri: metadataUri } = await metadataUploadResponse.json();

                // Generate mint
                const mint = generateSigner(umi);

                // Create NFT
                const nftConfig: any = {
                    mint,
                    name: item.name.trim(),
                    uri: metadataUri,
                    sellerFeeBasisPoints: percentAmount(royalty),
                    creators: [
                        {
                            address: umi.identity.publicKey,
                            verified: true,
                            share: 100,
                        },
                    ],
                };

                if (collection) {
                    nftConfig.collection = {
                        key: collection,
                        verified: false,
                    };
                }

                await createNft(umi, nftConfig).sendAndConfirm(umi);

                console.log(`NFT #${i + 1} minted:`, mint.publicKey);
            }

            toast.success(`Successfully minted ${nftItems.length} NFTs!`);

            // Reset form
            setNftItems([{ name: "", description: "", image: null, attributes: [] }]);
            setCollectionMint("");
            setMintingProgress({ current: 0, total: 0 });
        } catch (error) {
            console.error("Error bulk minting NFTs:", error);
            if (error instanceof Error) {
                toast.error(`Failed to mint NFTs: ${error.message}`);
            } else {
                toast.error("Failed to mint NFTs. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>Bulk Mint NFTs</CardTitle>
                <CardDescription>
                    Mint multiple NFTs at once with images on Cloudinary and metadata on IPFS.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="collectionMint">Collection Mint Address (Optional)</Label>
                    <Input
                        id="collectionMint"
                        value={collectionMint}
                        onChange={(e) => setCollectionMint(e.target.value)}
                        placeholder="Enter collection mint address"
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="royalty">Royalty Percentage</Label>
                    <Input
                        type="number"
                        id="royalty"
                        value={royaltyPercent}
                        onChange={(e) => setRoyaltyPercent(e.target.value)}
                        placeholder="5"
                        min={0}
                        max={100}
                        step={0.1}
                        disabled={loading}
                    />
                </div>

                <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">NFTs to Mint ({nftItems.length})</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addNftItem}
                            disabled={loading}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Add NFT
                        </Button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
                        {nftItems.map((item, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-3 bg-accent/5">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">NFT #{index + 1}</h4>
                                    {nftItems.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeNftItem(index)}
                                            disabled={loading}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={item.name}
                                        onChange={(e) => updateNftItem(index, 'name', e.target.value)}
                                        placeholder="NFT Name"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={item.description}
                                        onChange={(e) => updateNftItem(index, 'description', e.target.value)}
                                        placeholder="NFT Description"
                                        className="min-h-[60px]"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Image</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(index, e)}
                                        disabled={loading}
                                    />
                                    {item.image && (
                                        <p className="text-xs text-muted-foreground">
                                            {item.image.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {loading && mintingProgress.total > 0 && (
                    <div className="bg-accent/10 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Minting Progress</span>
                            <span className="text-sm text-muted-foreground">
                                {mintingProgress.current} / {mintingProgress.total}
                            </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${(mintingProgress.current / mintingProgress.total) * 100}%`
                                }}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={handleBulkMint}
                    disabled={loading}
                >
                    {loading ? <Spinner /> : <><Layers /> Bulk Mint {nftItems.length} NFT{nftItems.length > 1 ? 's' : ''}</>}
                </Button>
            </CardFooter>
        </Card>
    );
}
