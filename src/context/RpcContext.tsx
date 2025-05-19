import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type RpcContextType = {
    rpcUrl: string;
    rpc: String;
    setRpc: (rpc: "devnet" | "mainnet" | "testnet") => void;
};

const RpcContext = createContext<RpcContextType | undefined>(undefined);

const RPC_URLS = {
    devnet: "https://api.devnet.solana.com",
    mainnet: "https://api.mainnet-beta.solana.com",
    testnet: "https://api.testnet.solana.com",
};

export const RpcProvider = ({ children }: { children: ReactNode }) => {
    const [rpc, setRpcState] = useState<"devnet" | "mainnet" | "testnet">("devnet");

    const setRpc = (newRpc: "devnet" | "mainnet" | "testnet") => {
        setRpcState(newRpc);
    };

    const value = {
        rpcUrl: RPC_URLS[rpc],
        rpc,
        setRpc,
    };

    return <RpcContext.Provider value={value}>{children}</RpcContext.Provider>;
};

export const useRpc = () => {
    const context = useContext(RpcContext);
    if (!context) {
        throw new Error("useRpc must be used within a RpcProvider");
    }
    return context;
};