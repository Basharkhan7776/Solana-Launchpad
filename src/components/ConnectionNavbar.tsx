import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Wallet } from "@/provider/wallet-adapter";



export function ConnectionNavbar() {
    return (
        <Card className="w-full p-4">
            <div className="flex items-center justify-between">
                <Button> Devnet</Button>
                <Wallet />
            </div>
        </Card>
    )
}
