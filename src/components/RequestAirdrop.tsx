import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { Input } from "./ui/input";

export function RequestAirdrop() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState<number>(NaN);
    const [loading, setLoading] = useState<boolean>(false);

    const validateInputs = () => {
        if (!wallet.connected) {
            toast.error("Please connect your wallet first");
            return false;
        }
        if (!wallet.publicKey) {
            toast.error("Wallet public key is not available");
            return false;
        }
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return false;
        }
        if (amount > 2) {
            toast.error("Maximum airdrop amount is 2 SOL");
            return false;
        }
        return true;
    };

    const handleAirdrop = async () => {
        if (!validateInputs() || !wallet.publicKey) return;

        try {
            setLoading(true);
            const signature = await connection.requestAirdrop(
                wallet.publicKey,
                amount * 1e9
            );
            
            const confirmation = await connection.confirmTransaction(signature);
            
            if (confirmation.value.err) {
                throw new Error("Transaction failed to confirm");
            }

            toast.success(`Successfully airdropped ${amount} SOL`);
            setAmount(NaN);
        } catch (error) {
            console.error("Airdrop failed:", error);
            if (error instanceof Error) {
                toast.error(`Airdrop failed: ${error.message}`);
            } else {
                toast.error("Airdrop failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full h-full flex flex-col justify-between">
            <CardHeader>
                <CardTitle>Request Airdrop</CardTitle>
                <CardDescription>
                    Here you can request airdrop in Solana. Please fill the form below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleAirdrop(); }}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="amount">Enter the amount in SOL</Label>
                            <Input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(Number(e.target.value))} 
                                id="amount" 
                                placeholder="Enter the amount" 
                                min={0} 
                                max={2}
                                step={0.1}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full" 
                    onClick={handleAirdrop}
                    disabled={loading || !wallet.connected}
                >
                    {!loading ? <><ArrowDown /> Request Airdrop</> : <Spinner />}
                </Button>
            </CardFooter>
        </Card>
    );
}
