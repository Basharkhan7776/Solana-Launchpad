import { Connection, VersionedTransaction } from "@solana/web3.js";

const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote";
const JUPITER_SWAP_API = "https://quote-api.jup.ag/v6/swap";

export interface JupiterQuote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: number;
  routePlan: any[];
}

export interface QuoteResponse {
  quote: JupiterQuote;
  error?: string;
}

export async function getJupiterQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number = 50
): Promise<QuoteResponse> {
  try {
    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount: amount.toString(),
      slippageBps: slippageBps.toString(),
    });

    const response = await fetch(`${JUPITER_QUOTE_API}?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.statusText}`);
    }

    const quote = await response.json();
    return { quote };
  } catch (error) {
    console.error("Error fetching Jupiter quote:", error);
    return {
      quote: null as any,
      error: error instanceof Error ? error.message : "Failed to fetch quote"
    };
  }
}

export async function getJupiterSwapTransaction(
  quote: JupiterQuote,
  userPublicKey: string,
  wrapUnwrapSOL: boolean = true
): Promise<{ swapTransaction: string; error?: string }> {
  try {
    const response = await fetch(JUPITER_SWAP_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse: quote,
        userPublicKey,
        wrapAndUnwrapSol: wrapUnwrapSOL,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: "auto",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get swap transaction: ${response.statusText}`);
    }

    const { swapTransaction } = await response.json();
    return { swapTransaction };
  } catch (error) {
    console.error("Error getting swap transaction:", error);
    return {
      swapTransaction: "",
      error: error instanceof Error ? error.message : "Failed to get swap transaction",
    };
  }
}

export async function executeJupiterSwap(
  connection: Connection,
  swapTransaction: string,
  sendTransaction: any
): Promise<{ signature: string; error?: string }> {
  try {
    // Deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // Send transaction
    const signature = await sendTransaction(transaction, connection);

    // Confirm transaction
    const latestBlockHash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature,
    });

    return { signature };
  } catch (error) {
    console.error("Error executing swap:", error);
    return {
      signature: "",
      error: error instanceof Error ? error.message : "Failed to execute swap",
    };
  }
}
