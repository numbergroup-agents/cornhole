import { PublicKey } from "@solana/web3.js";

/**
 * Program IDs for all 5 Cornhole contracts.
 * These are placeholder addresses - replace with actual deployed program IDs.
 */
export const PROGRAM_IDS = {
  cornToken: new PublicKey(
    process.env.NEXT_PUBLIC_CORN_TOKEN_PROGRAM_ID ||
      "CornTkn111111111111111111111111111111111111"
  ),
  cornholeMatch: new PublicKey(
    process.env.NEXT_PUBLIC_CORNHOLE_MATCH_PROGRAM_ID ||
      "CornMtch11111111111111111111111111111111111"
  ),
  cornholeTournament: new PublicKey(
    process.env.NEXT_PUBLIC_CORNHOLE_TOURNAMENT_PROGRAM_ID ||
      "CornTrn111111111111111111111111111111111111"
  ),
  cornholeNft: new PublicKey(
    process.env.NEXT_PUBLIC_CORNHOLE_NFT_PROGRAM_ID ||
      "CornNft111111111111111111111111111111111111"
  ),
  cornholeStaking: new PublicKey(
    process.env.NEXT_PUBLIC_CORNHOLE_STAKING_PROGRAM_ID ||
      "CornStk111111111111111111111111111111111111"
  ),
};

/**
 * Placeholder IDL for the CORN Token program.
 * Replace with the actual generated IDL after `anchor build`.
 */
export const cornTokenIdl = {
  address: PROGRAM_IDS.cornToken.toBase58(),
  metadata: {
    name: "corn_token",
    version: "0.1.0",
    spec: "0.1.0",
  },
  instructions: [
    {
      name: "initialize",
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        { name: "authority", writable: true, signer: true },
        { name: "mint", writable: true },
        { name: "system_program" },
        { name: "token_program" },
        { name: "rent" },
      ],
      args: [
        { name: "decimals", type: "u8" },
        { name: "initial_supply", type: "u64" },
      ],
    },
    {
      name: "mint_to",
      discriminator: [241, 34, 48, 186, 37, 179, 123, 192],
      accounts: [
        { name: "authority", signer: true },
        { name: "mint", writable: true },
        { name: "destination", writable: true },
        { name: "token_program" },
      ],
      args: [{ name: "amount", type: "u64" }],
    },
  ],
  accounts: [],
  types: [],
};

/**
 * Placeholder IDL for the Cornhole Match program.
 */
export const cornholeMatchIdl = {
  address: PROGRAM_IDS.cornholeMatch.toBase58(),
  metadata: {
    name: "cornhole_match",
    version: "0.1.0",
    spec: "0.1.0",
  },
  instructions: [
    {
      name: "create_match",
      discriminator: [50, 143, 29, 185, 49, 76, 181, 93],
      accounts: [
        { name: "player1", writable: true, signer: true },
        { name: "match_account", writable: true },
        { name: "escrow", writable: true },
        { name: "system_program" },
      ],
      args: [
        { name: "mode", type: "u8" },
        { name: "wager", type: "u64" },
      ],
    },
    {
      name: "join_match",
      discriminator: [115, 234, 78, 200, 12, 67, 89, 145],
      accounts: [
        { name: "player2", writable: true, signer: true },
        { name: "match_account", writable: true },
        { name: "escrow", writable: true },
        { name: "system_program" },
      ],
      args: [],
    },
    {
      name: "commit_throw",
      discriminator: [78, 192, 45, 167, 34, 89, 201, 56],
      accounts: [
        { name: "player", signer: true },
        { name: "match_account", writable: true },
      ],
      args: [{ name: "hash", type: { array: ["u8", 32] } }],
    },
    {
      name: "reveal_throw",
      discriminator: [234, 56, 178, 90, 123, 45, 67, 89],
      accounts: [
        { name: "player", signer: true },
        { name: "match_account", writable: true },
      ],
      args: [
        { name: "angle", type: "u16" },
        { name: "power", type: "u8" },
        { name: "spin", type: "i8" },
        { name: "nonce", type: { array: ["u8", 16] } },
      ],
    },
    {
      name: "settle_match",
      discriminator: [145, 67, 234, 12, 89, 178, 56, 200],
      accounts: [
        { name: "authority", signer: true },
        { name: "match_account", writable: true },
        { name: "escrow", writable: true },
        { name: "winner_account", writable: true },
        { name: "loser_account", writable: true },
        { name: "system_program" },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "MatchAccount",
      discriminator: [200, 45, 167, 89, 34, 123, 78, 56],
    },
  ],
  types: [
    {
      name: "MatchAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "player1", type: "pubkey" },
          { name: "player2", type: { option: "pubkey" } },
          { name: "mode", type: "u8" },
          { name: "wager", type: "u64" },
          { name: "score1", type: "u16" },
          { name: "score2", type: "u16" },
          { name: "status", type: "u8" },
          { name: "current_round", type: "u8" },
          { name: "bump", type: "u8" },
        ],
      },
    },
  ],
};

/**
 * Placeholder IDL for the Cornhole Tournament program.
 */
export const cornholeTournamentIdl = {
  address: PROGRAM_IDS.cornholeTournament.toBase58(),
  metadata: {
    name: "cornhole_tournament",
    version: "0.1.0",
    spec: "0.1.0",
  },
  instructions: [
    {
      name: "create_tournament",
      discriminator: [89, 145, 200, 34, 67, 178, 12, 56],
      accounts: [
        { name: "organizer", writable: true, signer: true },
        { name: "tournament_account", writable: true },
        { name: "system_program" },
      ],
      args: [
        { name: "name", type: "string" },
        { name: "format", type: "u8" },
        { name: "max_players", type: "u16" },
        { name: "buy_in", type: "u64" },
      ],
    },
    {
      name: "register",
      discriminator: [34, 89, 56, 200, 145, 12, 178, 67],
      accounts: [
        { name: "player", writable: true, signer: true },
        { name: "tournament_account", writable: true },
        { name: "system_program" },
      ],
      args: [],
    },
  ],
  accounts: [],
  types: [],
};

/**
 * Placeholder IDL for the Cornhole NFT program.
 */
export const cornholeNftIdl = {
  address: PROGRAM_IDS.cornholeNft.toBase58(),
  metadata: {
    name: "cornhole_nft",
    version: "0.1.0",
    spec: "0.1.0",
  },
  instructions: [
    {
      name: "mint_cosmetic",
      discriminator: [56, 200, 89, 34, 145, 67, 12, 178],
      accounts: [
        { name: "authority", writable: true, signer: true },
        { name: "mint", writable: true },
        { name: "metadata", writable: true },
        { name: "token_account", writable: true },
        { name: "system_program" },
        { name: "token_program" },
        { name: "rent" },
      ],
      args: [
        { name: "cosmetic_type", type: "u8" },
        { name: "rarity", type: "u8" },
        { name: "name", type: "string" },
        { name: "uri", type: "string" },
      ],
    },
    {
      name: "equip",
      discriminator: [167, 45, 123, 78, 234, 56, 89, 34],
      accounts: [
        { name: "owner", signer: true },
        { name: "token_account" },
        { name: "player_state", writable: true },
      ],
      args: [{ name: "slot", type: "u8" }],
    },
  ],
  accounts: [],
  types: [],
};

/**
 * Placeholder IDL for the Cornhole Staking program.
 */
export const cornholeStakingIdl = {
  address: PROGRAM_IDS.cornholeStaking.toBase58(),
  metadata: {
    name: "cornhole_staking",
    version: "0.1.0",
    spec: "0.1.0",
  },
  instructions: [
    {
      name: "stake",
      discriminator: [206, 176, 202, 18, 200, 209, 179, 108],
      accounts: [
        { name: "staker", writable: true, signer: true },
        { name: "staker_token_account", writable: true },
        { name: "staking_pool", writable: true },
        { name: "stake_account", writable: true },
        { name: "token_program" },
        { name: "system_program" },
      ],
      args: [
        { name: "amount", type: "u64" },
        { name: "lock_period", type: "i64" },
      ],
    },
    {
      name: "unstake",
      discriminator: [90, 95, 107, 42, 205, 124, 50, 225],
      accounts: [
        { name: "staker", writable: true, signer: true },
        { name: "staker_token_account", writable: true },
        { name: "staking_pool", writable: true },
        { name: "stake_account", writable: true },
        { name: "token_program" },
      ],
      args: [],
    },
    {
      name: "claim_rewards",
      discriminator: [4, 144, 132, 71, 116, 23, 151, 80],
      accounts: [
        { name: "staker", writable: true, signer: true },
        { name: "staker_token_account", writable: true },
        { name: "reward_pool", writable: true },
        { name: "stake_account", writable: true },
        { name: "token_program" },
      ],
      args: [],
    },
  ],
  accounts: [],
  types: [],
};
