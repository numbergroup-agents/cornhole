"use client";

import { useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
  PROGRAM_IDS,
  cornTokenIdl,
  cornholeMatchIdl,
  cornholeTournamentIdl,
  cornholeNftIdl,
  cornholeStakingIdl,
} from "@/lib/idl";

/**
 * Hook that returns Anchor program instances for all 5 Cornhole contracts.
 * Uses the connected wallet for transaction signing.
 */
export function useProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction) return null;
    return new AnchorProvider(
      connection,
      wallet as any,
      AnchorProvider.defaultOptions()
    );
  }, [connection, wallet]);

  const programs = useMemo(() => {
    if (!provider) {
      return {
        cornToken: null,
        cornholeMatch: null,
        cornholeTournament: null,
        cornholeNft: null,
        cornholeStaking: null,
      };
    }

    return {
      cornToken: new Program(cornTokenIdl as any, provider),
      cornholeMatch: new Program(cornholeMatchIdl as any, provider),
      cornholeTournament: new Program(cornholeTournamentIdl as any, provider),
      cornholeNft: new Program(cornholeNftIdl as any, provider),
      cornholeStaking: new Program(cornholeStakingIdl as any, provider),
    };
  }, [provider]);

  return {
    provider,
    ...programs,
    connected: !!provider,
  };
}
