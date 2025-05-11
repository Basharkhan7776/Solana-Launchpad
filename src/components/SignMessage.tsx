import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function SignMessage() {
    return (
        <Card className="w-[350px]">
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
                            <Label htmlFor="amount">Enter the amount in SOL</Label>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter >
                <Button className="w-full" >Sign Message</Button>
            </CardFooter>
        </Card>
    )
}
