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

    const handleAirdrop = async () => {
        if (wallet.connected) {
            setLoading(true);
            try {
                if (!wallet.publicKey) {
                    throw new Error("Wallet public key is null");
                }
                const signature = await connection.requestAirdrop(wallet.publicKey, amount * 1e9);
                await connection.confirmTransaction(signature);
                toast.success(`Airdrop of ${amount} SOL successful!`);
                setLoading(false)
            } catch (error) {
                console.error("Airdrop failed:", error);
                console.log("Airdrop failed:", error);
                toast.error("Airdrop failed. Please try again.")
                setLoading(false);
            }
        } else {
            toast.warning("Please connect your wallet first.");
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
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="amount">Enter the amount in SOL</Label>
                            <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} id="amount" placeholder="Enter the amount" min={0} max={100}/>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter >
                <Button className="w-full" onClick={handleAirdrop}>{!loading ? <><ArrowDown /> Request Airdrop</> : <Spinner />}</Button>
            </CardFooter>
        </Card>
    );
}
