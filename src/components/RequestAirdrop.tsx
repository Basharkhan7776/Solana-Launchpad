import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { ArrowDown } from "lucide-react";



export function RequestAirdrop() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState<number>(0);

    const handleAirdrop = async () => {
        if (wallet.connected) {
            try {
                if (!wallet.publicKey) {
                    throw new Error("Wallet public key is null");
                }
                const signature = await connection.requestAirdrop(wallet.publicKey, amount * 1e9);
                await connection.confirmTransaction(signature);
                alert(`Airdrop of ${amount} SOL successful!`);
            } catch (error) {
                console.error("Airdrop failed:", error);
                alert("Airdrop failed. Please try again.");
            }
        } else {
            alert("Please connect your wallet first.");
        }
    };




    return (
        <Card className="w-auto">
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
                            <NumberInput value={amount} onChange={(e)=>setAmount(Number(e.target.value))} id="amount" placeholder="Enter the amount" min={0} max={100} stepper={1} />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter >
                <Button className="w-full" onClick={handleAirdrop}><ArrowDown/> Request Airdrop</Button>
            </CardFooter>
        </Card>
    );
}
