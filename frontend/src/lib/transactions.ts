import {
  Transaction,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token" with { type: "module" };
import { BN } from "@coral-xyz/anchor";
import { PROGRAM_IDS } from "./idl";

/**
 * Builds a transaction to create a new match on-chain.
 */
export async function buildCreateMatchTx(
  mode: string,
  wager: number,
  player: PublicKey
): Promise<Transaction> {
  const tx = new Transaction();

  // Placeholder instruction data - actual implementation depends on generated IDL
  const modeIndex = ["casual", "ranked", "high-roller", "practice"].indexOf(mode);
  const wagerLamports = new BN(wager * 1_000_000); // Convert to smallest denomination

  // In production, this would use the Anchor program's instruction builder:
  // const ix = await program.methods
  //   .createMatch(modeIndex, wagerLamports)
  //   .accounts({ player, matchAccount, systemProgram })
  //   .instruction();
  // tx.add(ix);

  console.log("[TX] buildCreateMatchTx:", { mode, wager, player: player.toBase58() });
  return tx;
}

/**
 * Builds a transaction to join an existing match.
 */
export async function buildJoinMatchTx(
  matchId: string,
  player: PublicKey
): Promise<Transaction> {
  const tx = new Transaction();

  // Placeholder: would derive match PDA from matchId and add join instruction
  console.log("[TX] buildJoinMatchTx:", { matchId, player: player.toBase58() });
  return tx;
}

/**
 * Builds a transaction to commit a throw hash (commit-reveal phase 1).
 */
export async function buildCommitThrowTx(
  matchId: string,
  hash: string,
  player: PublicKey
): Promise<Transaction> {
  const tx = new Transaction();

  // Placeholder: would add commit_throw instruction with the hash
  console.log("[TX] buildCommitThrowTx:", { matchId, hash });
  return tx;
}

/**
 * Builds a transaction to reveal throw parameters (commit-reveal phase 2).
 */
export async function buildRevealThrowTx(
  matchId: string,
  angle: number,
  power: number,
  spin: number,
  nonce: string,
  player: PublicKey
): Promise<Transaction> {
  const tx = new Transaction();

  // Placeholder: would add reveal_throw instruction with params
  console.log("[TX] buildRevealThrowTx:", { matchId, angle, power, spin, nonce });
  return tx;
}

/**
 * Builds a transaction to stake CORN tokens.
 */
export async function buildStakeTx(
  amount: number,
  lockDays: number,
  staker: PublicKey
): Promise<Transaction> {
  const tx = new Transaction();

  const amountBN = new BN(amount * 1_000_000);
  const lockPeriod = new BN(lockDays * 86400); // Convert days to seconds

  // Placeholder: would derive staking PDA and add stake instruction
  // const stakerTokenAccount = await getAssociatedTokenAddress(CORN_MINT, staker);
  // const ix = await stakingProgram.methods
  //   .stake(amountBN, lockPeriod)
  //   .accounts({ staker, stakerTokenAccount, stakingPool, ... })
  //   .instruction();
  // tx.add(ix);

  console.log("[TX] buildStakeTx:", { amount, lockDays, staker: staker.toBase58() });
  return tx;
}

/**
 * Builds a transaction to unstake CORN tokens.
 */
export async function buildUnstakeTx(
  staker: PublicKey
): Promise<Transaction> {
  const tx = new Transaction();

  // Placeholder: would add unstake instruction
  console.log("[TX] buildUnstakeTx:", { staker: staker.toBase58() });
  return tx;
}

/**
 * Builds a transaction to claim staking rewards.
 */
export async function buildClaimRewardsTx(
  staker: PublicKey
): Promise<Transaction> {
  const tx = new Transaction();

  // Placeholder: would add claim_rewards instruction
  console.log("[TX] buildClaimRewardsTx:", { staker: staker.toBase58() });
  return tx;
}
