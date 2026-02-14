"use client";

import { useState, useRef, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function WalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const truncatedAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!connected) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="bg-corn-gold text-black font-semibold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors text-sm"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-[#1a1a2e] border border-gray-700 text-white font-mono py-2 px-4 rounded-lg hover:border-corn-gold/50 transition-colors text-sm flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-corn-green" />
        {truncatedAddress}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1a1a2e] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-xs text-gray-500">Connected</p>
            <p className="text-sm text-white font-mono truncate">
              {publicKey?.toBase58()}
            </p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(publicKey?.toBase58() || "");
              setShowDropdown(false);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Copy Address
          </button>
          <button
            onClick={() => {
              disconnect();
              setShowDropdown(false);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-corn-red hover:bg-gray-800 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
