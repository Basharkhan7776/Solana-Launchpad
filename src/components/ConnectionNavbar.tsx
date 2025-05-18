import { Card } from "./ui/card";
import { Wallet } from "@/provider/wallet-adapter";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRpc } from "@/context/RpcContext";



export function ConnectionNavbar() {
    const { rpc, setRpc } = useRpc();




    return (
        <Card className="w-full p-4">
            <div className="flex items-center justify-between">
                <Select onValueChange={(value) => setRpc(value as "devnet" | "mainnet" | "testnet")}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={rpc.charAt(0).toUpperCase() + rpc.substring(1)} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="mainnet">Mainnet</SelectItem>
                        <SelectItem value="devnet">Devnet</SelectItem>
                        <SelectItem value="testnet">Testnet</SelectItem>
                    </SelectContent>
                </Select>

                <Wallet />
            </div>
        </Card>
    )
}
