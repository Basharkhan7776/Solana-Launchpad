import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import InputImage from "./ui/input-image";
import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_2022_PROGRAM_ID, createMintToInstruction, createAssociatedTokenAccountInstruction, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export function LaunchPad() {
    const [tokenName, setTokenName] = useState<string>("");
    const [symbol, setSymbol] = useState<string>("");
    const [supply, setSupply] = useState<number>(NaN);
    const [image, setImage] = useState<string>("");
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
        if (!tokenName.trim()) {
            toast.error("Please enter a token name");
            return false;
        }
        if (!symbol.trim()) {
            toast.error("Please enter a token symbol");
            return false;
        }
        if (isNaN(supply) || supply <= 0) {
            toast.error("Please enter a valid supply amount");
            return false;
        }
        if (!image) {
            toast.error("Please upload a token image");
            return false;
        }
        return true;
    };

    const handleSend = async () => {
        if (!validateInputs() || !wallet.publicKey) return;

        try {
            setLoading(true);
            const mintKeypair = Keypair.generate();
            const metadata = {
                mint: mintKeypair.publicKey,
                name: tokenName.trim(),
                symbol: symbol.trim().toUpperCase(),
                uri: image,
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

            const createMintSignature = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(createMintSignature);

            console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
            const associatedToken = getAssociatedTokenAddressSync(
                mintKeypair.publicKey,
                wallet.publicKey,
                false,
                TOKEN_2022_PROGRAM_ID
            );

            console.log(`Associated Token Address: ${associatedToken.toBase58()}`);
            toast.info(`Token Address: ${associatedToken.toBase58()}`);

            const createAtaTx = new Transaction().add(
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    associatedToken,
                    wallet.publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID
                )
            );

            const createAtaSignature = await wallet.sendTransaction(createAtaTx, connection);
            await connection.confirmTransaction(createAtaSignature);

            const mintToTx = new Transaction().add(
                createMintToInstruction(
                    mintKeypair.publicKey,
                    associatedToken,
                    wallet.publicKey,
                    supply * 10 ** 9,
                    [],
                    TOKEN_2022_PROGRAM_ID
                )
            );

            const mintToSignature = await wallet.sendTransaction(mintToTx, connection);
            await connection.confirmTransaction(mintToSignature);

            console.log("Minted successfully!");
            toast.success("Token created successfully!");
            
            // Reset form
            setTokenName("");
            setSymbol("");
            setSupply(NaN);
            setImage("");

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
            if (error instanceof Error) {
                toast.error(`Failed to create token: ${error.message}`);
            } else {
                toast.error("Failed to create token. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>Mint Custom Tokens</CardTitle>
                <CardDescription>
                    Here you can mint your own custom Solana tokens. Please fill the form below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col md:flex-row space-y-4 md:space-x-8 md:space-y-4">
                            <div className="flex w-auto md:w-[50%] flex-col space-y-1.5">
                                <Label htmlFor="tokenName">Enter the name of token</Label>
                                <Input
                                    id="tokenName"
                                    value={tokenName}
                                    onChange={(e) => setTokenName(e.target.value)}
                                    placeholder="Enter the token name"
                                    disabled={loading}
                                />
                                <Label htmlFor="symbol">Enter the symbol of token</Label>
                                <Input
                                    id="symbol"
                                    value={symbol}
                                    onChange={(e) => setSymbol(e.target.value)}
                                    placeholder="Enter the token symbol"
                                    disabled={loading}
                                />
                                <Label htmlFor="supply">Enter the initial supply</Label>
                                <Input
                                    type="number"
                                    id="supply"
                                    value={supply}
                                    onChange={(e) => setSupply(Number(e.target.value))}
                                    placeholder="Enter the token supply"
                                    min={0}
                                    step={0.1}
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex w-auto md:w-[50%] flex-col justify-center items-center space-y-1.5">
                                <Label htmlFor="image">Upload the image</Label>
                                <InputImage image={image} setImage={setImage} />
                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full" 
                    onClick={handleSend}
                    disabled={loading || !wallet.connected}
                >
                    {!loading ? <><CirclePlus /> Create Token</> : <Spinner />}
                </Button>
            </CardFooter>
        </Card>
    );
}
