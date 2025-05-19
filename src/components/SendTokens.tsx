import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowUp } from "lucide-react";
import { Input } from "./ui/input";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "sonner"
import { Spinner } from "./ui/spinner";

export function SendTokens() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState<number>(NaN);
    const [to, setTo] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const validateInputs = () => {
        if (!wallet.connected) {
            toast.error("Please connect your wallet first");
            return false;
        }
        if (!wallet.publicKey) {
            toast.error("Wallet public key is not available");
            return false;
        }
        if (!to) {
            toast.error("Please enter a recipient address");
            return false;
        }
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return false;
        }
        try {
            new PublicKey(to);
        } catch (error) {
            toast.error("Invalid recipient address");
            return false;
        }
        return true;
    };

    const handleSend = async () => {
        if (!validateInputs()) return;

        try {
            setLoading(true);
            const transaction = new Transaction();
            transaction.add(SystemProgram.transfer({
                fromPubkey: wallet.publicKey!,
                toPubkey: new PublicKey(to),
                lamports: amount * 1e9,
            }));

            const signature = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature);
            
            toast.success(`Successfully sent ${amount} SOL to ${to.slice(0, 4)}...${to.slice(-4)}`);
            setAmount(NaN);
            setTo("");
        } catch (error) {
            console.error("Transaction failed:", error);
            if (error instanceof Error) {
                toast.error(`Transaction failed: ${error.message}`);
            } else {
                toast.error("Transaction failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full h-full flex flex-col justify-between">
            <CardHeader>
                <CardTitle>Send Solana</CardTitle>
                <CardDescription>
                    Here you can send Solana to any wallet address. Please fill the form below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="to">Enter recipient wallet address</Label>
                            <Input 
                                id="to" 
                                value={to} 
                                placeholder="Enter the address" 
                                onChange={(e) => setTo(e.target.value)}
                                disabled={loading}
                            />
                            <Label htmlFor="amount">Enter the amount that you want to send</Label>
                            <Input 
                                type="number" 
                                id="amount" 
                                value={amount} 
                                placeholder="Enter the amount" 
                                min={0} 
                                max={100} 
                                onChange={(e) => setAmount(Number(e.target.value))}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full" 
                    onClick={handleSend}
                    disabled={loading}
                >
                    {!loading ? <><ArrowUp /> Send Token</> : <Spinner />}
                </Button>
            </CardFooter>
        </Card>
    );
}
