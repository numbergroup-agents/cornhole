"use client";

import { useEffect, useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

const CORN_TOKEN_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_CORN_MINT || "11111111111111111111111111111111"
);

const REFRESH_INTERVAL = 15_000; // 15 seconds

/**
 * Hook that fetches and auto-refreshes the $CORN token balance
 * for the currently connected wallet.
 */
export function useCornBalance() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connected) {
      setBalance(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Find the associated token account for the CORN mint
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { mint: CORN_TOKEN_MINT }
      );

      if (tokenAccounts.value.length > 0) {
        const accountData = tokenAccounts.value[0].account.data.parsed;
        const amount = accountData.info.tokenAmount.uiAmount || 0;
        setBalance(amount);
      } else {
        setBalance(0);
      }
    } catch (err) {
      console.error("Failed to fetch CORN balance:", err);
      setError("Failed to fetch balance");
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey, connected]);

  // Initial fetch
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Auto-refresh on interval
  useEffect(() => {
    if (!connected) return;

    const interval = setInterval(fetchBalance, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [connected, fetchBalance]);

  return {
    balance,
    loading,
    error,
    refresh: fetchBalance,
  };
}
