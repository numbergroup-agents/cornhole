"use client";

import { ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { Navbar } from "@/components/Navbar";
import { SocketProvider } from "@/hooks/useSocket";

import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl("devnet"),
    []
  );

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <html lang="en" className="dark">
      <head>
        <title>CORNHOLE - On-Chain Skill-Based Tossing</title>
        <meta
          name="description"
          content="Compete in on-chain cornhole matches for $CORN tokens. 1v1 matches, tournaments, NFT cosmetics, and staking."
        />
      </head>
      <body className="min-h-screen bg-[#0a0a0f]">
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <SocketProvider>
                <Navbar />
                <main className="pt-16">{children}</main>
              </SocketProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}
