import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  PROGRAM_IDS,
  cornTokenIdl,
  cornholeMatchIdl,
  cornholeTournamentIdl,
  cornholeNftIdl,
  cornholeStakingIdl,
} from "./idl";

type ProgramName =
  | "cornToken"
  | "cornholeMatch"
  | "cornholeTournament"
  | "cornholeNft"
  | "cornholeStaking";

const idlMap: Record<ProgramName, object> = {
  cornToken: cornTokenIdl,
  cornholeMatch: cornholeMatchIdl,
  cornholeTournament: cornholeTournamentIdl,
  cornholeNft: cornholeNftIdl,
  cornholeStaking: cornholeStakingIdl,
};

/**
 * Creates an AnchorProvider from a wallet adapter connection.
 */
export function createProvider(
  connection: Connection,
  wallet: any
): AnchorProvider {
  return new AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
    commitment: "confirmed",
  });
}

/**
 * Returns a Program instance for the specified contract.
 *
 * @param programName - Name of the program (cornToken, cornholeMatch, etc.)
 * @param provider - AnchorProvider with wallet and connection
 * @returns Program instance
 */
export function getProgram(
  programName: ProgramName,
  provider: AnchorProvider
): Program {
  const idl = idlMap[programName];
  if (!idl) {
    throw new Error(`Unknown program: ${programName}`);
  }

  return new Program(idl as any, provider);
}

/**
 * Returns all program instances.
 */
export function getAllPrograms(provider: AnchorProvider) {
  return {
    cornToken: getProgram("cornToken", provider),
    cornholeMatch: getProgram("cornholeMatch", provider),
    cornholeTournament: getProgram("cornholeTournament", provider),
    cornholeNft: getProgram("cornholeNft", provider),
    cornholeStaking: getProgram("cornholeStaking", provider),
  };
}

/**
 * Gets a read-only connection (no wallet needed).
 */
export function getReadOnlyConnection(): Connection {
  const endpoint =
    process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl("devnet");
  return new Connection(endpoint, "confirmed");
}

export { PROGRAM_IDS };
