import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export function Showbalance() {
    const [balance, setBalance] = useState<number>(NaN);
    const wallet = useWallet();
    const { connection } = useConnection();
    const [loading, setLoading] = useState<boolean>(false);

    const getBalance = async () => {
        if (!wallet.connected || !wallet.publicKey) {
            toast.error("Please connect your wallet first");
            return;
        }

        try {
            setLoading(true);
            const balance = await connection.getBalance(wallet.publicKey);
            setBalance(balance / 1e9); // Convert lamports to SOL
            toast.success("Balance updated successfully");
        } catch (error) {
            console.error("Error fetching balance:", error);
            if (error instanceof Error) {
                toast.error(`Failed to fetch balance: ${error.message}`);
            } else {
                toast.error("Failed to fetch balance. Please try again.");
            }
            setBalance(NaN);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (wallet.connected && wallet.publicKey) {
            getBalance();
        } else {
            setBalance(NaN);
        }
    }, [wallet.publicKey, connection]);

    return (
        <Card className="w-full h-full flex flex-col justify-between">
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
                            <h1 className="text-2xl">
                                {Number.isNaN(balance) 
                                    ? wallet.connected 
                                        ? <Spinner/> 
                                        : "..."
                                    : balance.toFixed(4)}
                            </h1>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button 
                    className="w-full" 
                    onClick={getBalance}
                    disabled={loading}
                >
                    {!loading ? <><RefreshCcw /> Refresh</> : <Spinner />}
                </Button>
            </CardFooter>
        </Card>
    );
}
