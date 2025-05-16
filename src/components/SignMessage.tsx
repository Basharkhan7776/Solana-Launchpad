import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useWallet } from "@solana/wallet-adapter-react";
import { ed25519 } from '@noble/curves/ed25519';
import bs58 from "bs58";
import { useState } from "react";
import { MessageSquareCode } from "lucide-react";
import { Textarea } from "./ui/textarea";

export default function SignMessage() {
    const { publicKey, signMessage } = useWallet();
    const [message, setMessage] = useState<string>("");

    const handleSign = async () => {
        try {
            if (!publicKey) {
                throw new Error("Wallet not connected");
            }

            if (!signMessage) {
                throw new Error("Wallet does not support signing messages");
            }

            // Encode the message
            const encoder = new TextEncoder().encode(message);

            // Sign the message
            const signature = await signMessage(encoder);

            // Verify the signature
            const isValid = ed25519.verify(signature, encoder, publicKey.toBuffer());
            if (!isValid) {
                throw new Error("Signature verification failed");
            }

            // Display success message
            alert(`Success! Signature: ${bs58.encode(signature)}`);
        } catch (error) {
            // Handle errors gracefully
            alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    };




    return (
        <Card className="w-full h-full flex flex-col justify-between">
            <CardHeader>
                <CardTitle>Sign Message</CardTitle>
                <CardDescription>
                    Here you can sign a message with your wallet if your wallet support. Please fill the form below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="amount">Enter the message</Label>
                            <Textarea id="message" value={message} placeholder="Enter the message" onChange={(e) => setMessage(e.target.value)} className="resize-none h-24" />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter >
                <Button className="w-full" onClick={handleSign}><MessageSquareCode/> Sign Message</Button>
            </CardFooter>
        </Card>
    )
}
