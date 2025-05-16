import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import InputImage from "./ui/input-image";
import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { MINT_SIZE, TOKEN_2022_PROGRAM_ID, createMintToInstruction, createAssociatedTokenAccountInstruction, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType, mintTo, getOrCreateAssociatedTokenAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';

export function LaunchPad() {
    const [tokenName, setTokenName] = useState<string>("");
    const [symbol, setSymbol] = useState<string>("");
    const [supply, setSupply] = useState<number>(0);
    const [image, setImage] = useState<string>("");
    const { connection } = useConnection();
    const wallet = useWallet();

    const handleSend = async () => {
        if (!wallet.publicKey) {
            console.error("Wallet not connected");
            return;
        }

        if (!image) {
            console.error("Image URL is missing");
            return;
        }

        try {
            const mintKeypair = Keypair.generate();
            const metadata = {
                mint: mintKeypair.publicKey,
                name: tokenName,
                symbol: symbol,
                uri: image, // Cloudinary URL
                additionalMetadata: [],
            };

            const mintLen = getMintLen([ExtensionType.MetadataPointer]);
            const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

            const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: mintLen,
                    lamports,
                    programId: TOKEN_2022_PROGRAM_ID,
                }),
                createInitializeMetadataPointerInstruction(
                    mintKeypair.publicKey,
                    wallet.publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID
                ),
                createInitializeMintInstruction(
                    mintKeypair.publicKey,
                    9,
                    wallet.publicKey,
                    null,
                    TOKEN_2022_PROGRAM_ID
                ),
                createInitializeInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    mint: mintKeypair.publicKey,
                    metadata: mintKeypair.publicKey,
                    name: metadata.name,
                    symbol: metadata.symbol,
                    uri: metadata.uri, // Ensure this is passed correctly
                    mintAuthority: wallet.publicKey,
                    updateAuthority: wallet.publicKey,
                })
            );

            transaction.feePayer = wallet.publicKey;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            transaction.partialSign(mintKeypair);

            await wallet.sendTransaction(transaction, connection);

            console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
            const associatedToken = getAssociatedTokenAddressSync(
                mintKeypair.publicKey,
                wallet.publicKey,
                false,
                TOKEN_2022_PROGRAM_ID
            );

            console.log(`Associated Token Address: ${associatedToken.toBase58()}`);

            const transaction2 = new Transaction().add(
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    associatedToken,
                    wallet.publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID
                )
            );

            await wallet.sendTransaction(transaction2, connection);

            const transaction3 = new Transaction().add(
                createMintToInstruction(
                    mintKeypair.publicKey,
                    associatedToken,
                    wallet.publicKey,
                    supply * 10 ** 9, 
                    [],
                    TOKEN_2022_PROGRAM_ID
                )
            );

            await wallet.sendTransaction(transaction3, connection);

            console.log("Minted successfully!");

            // Debug metadata
            const metadataAccount = mintKeypair.publicKey; // Use the PublicKey directly
            const metadataInfo = await connection.getAccountInfo(metadataAccount);
            if (metadataInfo) {
                console.log("Metadata Info:", metadataInfo.data.toString());
            } else {
                console.error("Metadata account not found");
            }
        } catch (error) {
            console.error("Error creating token:", error);
        }
    };


    console.log(image);

    return (
        <Card className="w-auto">
            <CardHeader>
                <CardTitle>Mint Custom Tokens</CardTitle>
                <CardDescription>
                    Here you can mint your own custom Solana tokens. Please fill the form below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex space-x-8">
                            <div className="flex w-[350px] flex-col space-y-1.5">
                                <Label htmlFor="tokenName">Enter the name of token</Label>
                                <Input
                                    id="tokenName"
                                    value={tokenName}
                                    onChange={(e) => setTokenName(e.target.value)}
                                    placeholder="Enter the token name"
                                />
                                <Label htmlFor="symbol">Enter the symbol of token</Label>
                                <Input
                                    id="symbol"
                                    value={symbol}
                                    onChange={(e) => setSymbol(e.target.value)}
                                    placeholder="Enter the token symbol"
                                />
                                <Label htmlFor="supply">Enter the initial supply</Label>
                                <Input
                                    id="supply"
                                    type="number"
                                    value={supply}
                                    onChange={(e) => setSupply(Number(e.target.value))}
                                    placeholder="Enter the token supply"
                                />
                            </div>
                            <div className="flex w-[160px] flex-col justify-center items-center space-y-1.5">
                                <Label htmlFor="image">Upload the image</Label>
                                <InputImage image={image} setImage={setImage}/>
                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleSend}>
                    <CirclePlus /> Create Token
                </Button>
            </CardFooter>
        </Card>
    );
}
