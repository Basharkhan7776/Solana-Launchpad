"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import InputImage from "./ui/input-image";
import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

export function NftMint() {
    const [nftName, setNftName] = useState<string>("");
    const [symbol, setSymbol] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<string | null>(null);
    const [externalUrl, setExternalUrl] = useState<string>("");
    const [royaltyPercent, setRoyaltyPercent] = useState<string>("5");
    const { connection } = useConnection();
    const [loading, setLoading] = useState(false);
    const wallet = useWallet();

    const validateInputs = () => {
        if (!wallet.connected) {
            toast.error("Please connect your wallet first");
            return false;
        }
        if (!wallet.publicKey) {
            toast.error("Wallet public key is not available");
            return false;
        }
        if (!nftName.trim()) {
            toast.error("Please enter an NFT name");
            return false;
        }
        if (!symbol.trim()) {
            toast.error("Please enter a symbol");
            return false;
        }
        if (!description.trim()) {
            toast.error("Please enter a description");
            return false;
        }
        if (!image) {
            toast.error("Please upload an NFT image");
            return false;
        }
        const royalty = parseFloat(royaltyPercent);
        if (isNaN(royalty) || royalty < 0 || royalty > 100) {
            toast.error("Royalty must be between 0 and 100");
            return false;
        }
        return true;
    };

    const handleMintNft = async () => {
        if (!validateInputs() || !wallet.publicKey) return;

        try {
            setLoading(true);

            // Upload image first (using the base64 data URL from InputImage)
            toast.info("Uploading image...");
            const imageBlob = await fetch(image!).then(r => r.blob());
            const imageFormData = new FormData();
            imageFormData.append('file', imageBlob, 'nft-image.png');

            const imageUploadResponse = await fetch('/api/upload/image', {
                method: 'POST',
                body: imageFormData,
            });

            if (!imageUploadResponse.ok) {
                throw new Error('Failed to upload image');
            }

            const { url: imageUri } = await imageUploadResponse.json();
            console.log("Image uploaded to:", imageUri);

            // Create metadata JSON
            const metadata = {
                name: nftName.trim(),
                symbol: symbol.trim().toUpperCase(),
                description: description.trim(),
                image: imageUri,
                external_url: externalUrl.trim() || undefined,
                attributes: [],
                properties: {
                    files: [
                        {
                            uri: imageUri,
                            type: imageBlob.type,
                        },
                    ],
                    category: "image",
                },
            };

            // Upload metadata to IPFS
            toast.info("Uploading metadata to IPFS...");
            const metadataUploadResponse = await fetch('/api/upload/metadata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ metadata }),
            });

            if (!metadataUploadResponse.ok) {
                throw new Error('Failed to upload metadata');
            }

            const { uri: metadataUri } = await metadataUploadResponse.json();
            console.log("Metadata uploaded to:", metadataUri);

            // Initialize Umi
            const umi = createUmi(connection.rpcEndpoint)
                .use(walletAdapterIdentity(wallet))
                .use(mplTokenMetadata());

            // Generate a new mint address
            const mint = generateSigner(umi);

            // Create NFT
            toast.info("Creating NFT on Solana...");
            const royalty = parseFloat(royaltyPercent);
            await createNft(umi, {
                mint,
                name: nftName.trim(),
                symbol: symbol.trim().toUpperCase(),
                uri: metadataUri,
                sellerFeeBasisPoints: percentAmount(royalty),
                creators: [
                    {
                        address: umi.identity.publicKey,
                        verified: true,
                        share: 100,
                    },
                ],
            }).sendAndConfirm(umi);

            console.log("NFT minted successfully!");
            console.log("Mint address:", mint.publicKey);
            toast.success(`NFT minted successfully! Mint: ${mint.publicKey}`);

            // Reset form
            setNftName("");
            setSymbol("");
            setDescription("");
            setImage(null);
            setExternalUrl("");
            setRoyaltyPercent("5");
        } catch (error) {
            console.error("Error creating NFT:", error);
            if (error instanceof Error) {
                toast.error(`Failed to create NFT: ${error.message}`);
            } else {
                toast.error("Failed to create NFT. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>Mint NFT</CardTitle>
                <CardDescription>
                    Create your own NFT on Solana with images on Cloudinary and metadata on IPFS.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleMintNft(); }}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col md:flex-row space-y-4 md:space-x-8 md:space-y-0">
                            <div className="flex w-full md:w-[50%] flex-col space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="nftName">NFT Name</Label>
                                    <Input
                                        id="nftName"
                                        value={nftName}
                                        onChange={(e) => setNftName(e.target.value)}
                                        placeholder="My Awesome NFT"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="symbol">Symbol</Label>
                                    <Input
                                        id="symbol"
                                        value={symbol}
                                        onChange={(e) => setSymbol(e.target.value)}
                                        placeholder="MYNFT"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe your NFT..."
                                        className="min-h-[100px]"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="externalUrl">External URL (Optional)</Label>
                                    <Input
                                        id="externalUrl"
                                        value={externalUrl}
                                        onChange={(e) => setExternalUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-1.5">
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
                            </div>
                            <div className="flex w-full md:w-[50%] flex-col justify-center items-center space-y-1.5">
                                <Label htmlFor="image">Upload NFT Image</Label>
                                <InputImage image={image} setImage={setImage} />
                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={handleMintNft}
                    disabled={loading}
                >
                    {!loading ? <><ImagePlus /> Mint NFT</> : <Spinner />}
                </Button>
            </CardFooter>
        </Card>
    );
}
