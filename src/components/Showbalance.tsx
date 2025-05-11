import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function Showbalance() {
    const [balance, setBalance] = useState<number>(0);
    const wallet = useWallet();
    const { connection } = useConnection();

    const getBalance = async () => {
        if (wallet.publicKey) {
            try {
                const balance = await connection.getBalance(wallet.publicKey);
                setBalance(balance / 1e9); // Convert lamports to SOL
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        }
    }

    useEffect(() => {
        getBalance();
    }, [wallet.publicKey, connection]);

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Current balance</CardTitle>
                <CardDescription>
                    Here you can check your current balance in Solana wallet.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="amount">SOL :</Label>
                            <h1>{balance}</h1>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter >
                <Button className="w-full" onClick={getBalance}><RefreshCcw/> Refresh</Button>
            </CardFooter>
        </Card>
    )
}
