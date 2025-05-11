import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowUp } from "lucide-react";
import { Input } from "./ui/input";
import { NumberInput } from "./ui/number-input";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export function SendTokens() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState<number>(0);
    const [to, setTo] = useState<string>("");


    const handleSend = async () => {
        if (wallet.connected) {
            try {
                if (!wallet.publicKey) {
                    throw new Error("Wallet public key is null");
                }
                const transaction = new Transaction();
                transaction.add(SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(to),
                    lamports: amount * 1e9, 
                }));
                await wallet.sendTransaction(transaction, connection);
                alert(`Airdrop of ${amount} SOL successful! to ${to}`);
            } catch (error) {
                console.error("Airdrop failed:", error);
                alert("Airdrop failed. Please try again.");
            }
        } else {
            alert("Please connect your wallet first.");
        }
    };




    return (
        <Card className="w-[350px]">
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
                            <Input id="to" placeholder="Enter the address" onChange={()=>setTo} />
                            <Label htmlFor="amount">Enter the amount that you want to send</Label>
                            <NumberInput id="amount" placeholder="Enter the amount" min={0} max={100} stepper={1} onChange={()=>setAmount} />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter >
                <Button className="w-full" onClick={handleSend} ><ArrowUp /> Send Token</Button>
            </CardFooter>
        </Card>
    )
}
