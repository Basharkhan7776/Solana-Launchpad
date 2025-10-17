"use client";

import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ArrowDownUp, Settings, RefreshCcw } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { motion, AnimatePresence } from "motion/react";
import { getJupiterQuote, getJupiterSwapTransaction, executeJupiterSwap, JupiterQuote } from "@/lib/jupiter";

// Popular Solana tokens
const POPULAR_TOKENS = [
  { symbol: "SOL", mint: "So11111111111111111111111111111111111111112", decimals: 9 },
  { symbol: "USDC", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6 },
  { symbol: "USDT", mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", decimals: 6 },
  { symbol: "RAY", mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", decimals: 6 },
  { symbol: "JUP", mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", decimals: 6 },
];

export function SwapInterface() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string>("");
  const [inputMint, setInputMint] = useState<string>(POPULAR_TOKENS[0].mint);
  const [outputMint, setOutputMint] = useState<string>(POPULAR_TOKENS[1].mint);
  const [slippage, setSlippage] = useState<number>(0.5);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [quote, setQuote] = useState<JupiterQuote | null>(null);
  const [fetchingQuote, setFetchingQuote] = useState(false);

  // Fetch quote when input changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (!inputAmount || parseFloat(inputAmount) <= 0) {
        setOutputAmount("");
        setQuote(null);
        return;
      }

      setFetchingQuote(true);
      try {
        const inputToken = POPULAR_TOKENS.find(t => t.mint === inputMint);
        const outputToken = POPULAR_TOKENS.find(t => t.mint === outputMint);
        const inputDecimals = inputToken?.decimals || 9;

        const amount = Math.floor(parseFloat(inputAmount) * 10 ** inputDecimals);
        const slippageBps = Math.floor(slippage * 100);

        const { quote: jupiterQuote, error } = await getJupiterQuote(
          inputMint,
          outputMint,
          amount,
          slippageBps
        );

        if (error) {
          toast.error(error);
          setOutputAmount("");
          setQuote(null);
          return;
        }

        if (jupiterQuote) {
          setQuote(jupiterQuote);
          const outDecimals = outputToken?.decimals || 9;
          const outAmount = parseInt(jupiterQuote.outAmount) / 10 ** outDecimals;
          setOutputAmount(outAmount.toFixed(6));
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
        setOutputAmount("");
        setQuote(null);
      } finally {
        setFetchingQuote(false);
      }
    };

    const debounceTimer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(debounceTimer);
  }, [inputAmount, inputMint, outputMint, slippage]);

  const handleSwap = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!quote) {
      toast.error("No quote available. Please try again.");
      return;
    }

    try {
      setLoading(true);

      // Get swap transaction from Jupiter
      const { swapTransaction, error: swapError } = await getJupiterSwapTransaction(
        quote,
        wallet.publicKey.toString()
      );

      if (swapError || !swapTransaction) {
        toast.error(swapError || "Failed to get swap transaction");
        return;
      }

      // Execute the swap
      const { signature, error: execError } = await executeJupiterSwap(
        connection,
        swapTransaction,
        wallet.sendTransaction
      );

      if (execError || !signature) {
        toast.error(execError || "Failed to execute swap");
        return;
      }

      toast.success(`Swap completed! Signature: ${signature.slice(0, 8)}...`);
      setInputAmount("");
      setOutputAmount("");
      setQuote(null);
    } catch (error) {
      console.error("Swap error:", error);
      toast.error("Swap failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const swapTokens = () => {
    const tempMint = inputMint;
    const tempAmount = inputAmount;
    setInputMint(outputMint);
    setOutputMint(tempMint);
    setInputAmount(outputAmount);
    setOutputAmount(tempAmount);
  };

  const inputToken = POPULAR_TOKENS.find(t => t.mint === inputMint);
  const outputToken = POPULAR_TOKENS.find(t => t.mint === outputMint);

  const priceImpact = quote?.priceImpactPct || 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Swap Tokens
            </CardTitle>
            <CardDescription>
              Trade tokens with the best rates
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-accent/10 rounded-lg space-y-2">
                <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
                <div className="flex gap-2">
                  {[0.1, 0.5, 1.0].map((value) => (
                    <Button
                      key={value}
                      size="sm"
                      variant={slippage === value ? "default" : "outline"}
                      onClick={() => setSlippage(value)}
                    >
                      {value}%
                    </Button>
                  ))}
                  <Input
                    id="slippage"
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                    className="w-20"
                    step={0.1}
                    min={0.1}
                    max={50}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Token */}
        <div className="space-y-2">
          <Label>You Pay</Label>
          <div className="flex gap-2">
            <select
              value={inputMint}
              onChange={(e) => setInputMint(e.target.value)}
              className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {POPULAR_TOKENS.map((token) => (
                <option key={token.mint} value={token.mint}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <Input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1"
              step="any"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={swapTokens}
            className="rounded-full"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        {/* Output Token */}
        <div className="space-y-2">
          <Label>You Receive</Label>
          <div className="flex gap-2">
            <select
              value={outputMint}
              onChange={(e) => setOutputMint(e.target.value)}
              className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {POPULAR_TOKENS.map((token) => (
                <option key={token.mint} value={token.mint}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <div className="relative flex-1">
              <Input
                type="text"
                value={outputAmount}
                readOnly
                placeholder="0.00"
                className="flex-1 bg-muted pr-10"
              />
              {fetchingQuote && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Spinner className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Swap Details */}
        {quote && inputAmount && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-accent/10 rounded-lg space-y-1 text-sm"
          >
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rate:</span>
              <span>
                1 {inputToken?.symbol} ≈{" "}
                {outputAmount && inputAmount
                  ? (parseFloat(outputAmount) / parseFloat(inputAmount)).toFixed(6)
                  : "0"}{" "}
                {outputToken?.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price Impact:</span>
              <span className={priceImpact > 1 ? "text-destructive" : "text-green-500"}>
                {priceImpact.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slippage:</span>
              <span>{slippage}%</span>
            </div>
          </motion.div>
        )}

        {/* Swap Button */}
        <GradientButton
          className="w-full"
          onClick={handleSwap}
          disabled={loading || fetchingQuote || !wallet.connected || !inputAmount || !quote}
        >
          {loading ? (
            <Spinner />
          ) : fetchingQuote ? (
            <>
              <Spinner className="h-4 w-4" />
              Getting Quote...
            </>
          ) : !wallet.connected ? (
            "Connect Wallet"
          ) : !quote ? (
            "Enter Amount"
          ) : (
            <>
              <RefreshCcw className="h-4 w-4" />
              Swap
            </>
          )}
        </GradientButton>
      </CardContent>
    </Card>
  );
}
