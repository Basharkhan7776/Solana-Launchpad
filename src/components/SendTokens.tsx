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


    const handleSend = async () => {
        if (wallet.connected) {
            try {
                setLoading(true);
                if (!wallet.publicKey) {
                    throw new Error("Wallet public key is null");
                    toast.error("Wallet is not Connected or pub key is null");
                    setLoading(false)
                }
                const transaction = new Transaction();
                transaction.add(SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(to),
                    lamports: amount * 1e9,
                }));
                await wallet.sendTransaction(transaction, connection);
                toast.success(`Transfer of ${amount} SOL successful! to ${to}`);
                setLoading(false)
            } catch (error) {
                console.error("Failed:", error);
                toast.error("Failed please try again.");
                setLoading(false)
            }
        } else {
            toast.warning("Please connect your wallet first.")
            setLoading(false)
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
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="to">Enter recpient wallet address</Label>
                            <Input id="to" value={to} placeholder="Enter the address" onChange={(e) => setTo(e.target.value)} />
                            <Label htmlFor="amount">Enter the amount that you want to send</Label>
                            <Input type="number" id="amount" value={amount} placeholder="Enter the amount" min={0} max={100} onChange={(e) => setAmount(Number(e.target.value))} />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter >
                <Button className="w-full" onClick={handleSend} >{(!loading) ? <><ArrowUp /> Send Token</> : <Spinner />}</Button>
            </CardFooter>
        </Card>
    )
}
