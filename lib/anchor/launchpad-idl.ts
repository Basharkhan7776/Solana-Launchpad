export type LaunchpadIDL = {
  "version": "0.1.0",
  "name": "launchpad",
  "instructions": [
    {
      "name": "initializePresale",
      "accounts": [
        { "name": "presale", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "tokenMint", "isMut": false, "isSigner": false },
        { "name": "presaleVault", "isMut": true, "isSigner": false },
        { "name": "paymentMint", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "rent", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "presaleId", "type": "string" },
        {
          "name": "params",
          "type": {
            "defined": "InitializePresaleParams"
          }
        }
      ]
    },
    {
      "name": "contribute",
      "accounts": [
        { "name": "presale", "isMut": true, "isSigner": false },
        { "name": "contribution", "isMut": true, "isSigner": false },
        { "name": "whitelist", "isMut": false, "isSigner": false, "isOptional": true },
        { "name": "contributor", "isMut": true, "isSigner": true },
        { "name": "treasury", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "amount", "type": "u64" }
      ]
    },
    {
      "name": "claimTokens",
      "accounts": [
        { "name": "presale", "isMut": false, "isSigner": false },
        { "name": "contribution", "isMut": true, "isSigner": false },
        { "name": "presaleVault", "isMut": true, "isSigner": false },
        { "name": "contributorTokenAccount", "isMut": true, "isSigner": false },
        { "name": "contributor", "isMut": false, "isSigner": true },
        { "name": "tokenProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "finalizePresale",
      "accounts": [
        { "name": "presale", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": false, "isSigner": true }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Presale",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "authority", "type": "publicKey" },
          { "name": "tokenMint", "type": "publicKey" },
          { "name": "presaleVault", "type": "publicKey" },
          { "name": "paymentMint", "type": "publicKey" },
          { "name": "softCap", "type": "u64" },
          { "name": "hardCap", "type": "u64" },
          { "name": "minContribution", "type": "u64" },
          { "name": "maxContribution", "type": "u64" },
          { "name": "tokenPrice", "type": "u64" },
          { "name": "tokensSold", "type": "u64" },
          { "name": "totalRaised", "type": "u64" },
          { "name": "startTime", "type": "i64" },
          { "name": "endTime", "type": "i64" },
          { "name": "vestingEnabled", "type": "bool" },
          { "name": "vestingCliff", "type": "i64" },
          { "name": "vestingDuration", "type": "i64" },
          { "name": "isWhitelisted", "type": "bool" },
          { "name": "isFinalized", "type": "bool" },
          { "name": "isPaused", "type": "bool" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "Contribution",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "presale", "type": "publicKey" },
          { "name": "contributor", "type": "publicKey" },
          { "name": "amountPaid", "type": "u64" },
          { "name": "tokensAllocated", "type": "u64" },
          { "name": "tokensClaimed", "type": "u64" },
          { "name": "lastClaimTime", "type": "i64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitializePresaleParams",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "softCap", "type": "u64" },
          { "name": "hardCap", "type": "u64" },
          { "name": "minContribution", "type": "u64" },
          { "name": "maxContribution", "type": "u64" },
          { "name": "tokenPrice", "type": "u64" },
          { "name": "startTime", "type": "i64" },
          { "name": "endTime", "type": "i64" },
          { "name": "vestingEnabled", "type": "bool" },
          { "name": "vestingCliff", "type": "i64" },
          { "name": "vestingDuration", "type": "i64" },
          { "name": "isWhitelisted", "type": "bool" }
        ]
      }
    }
  ],
  "errors": [
    { "code": 6000, "name": "PresaleNotStarted", "msg": "Presale has not started yet" },
    { "code": 6001, "name": "PresaleEnded", "msg": "Presale has already ended" },
    { "code": 6002, "name": "PresalePaused", "msg": "Presale is paused" },
    { "code": 6003, "name": "BelowMinContribution", "msg": "Contribution amount is below minimum" },
    { "code": 6004, "name": "ExceedsMaxContribution", "msg": "Contribution amount exceeds maximum" },
    { "code": 6005, "name": "HardCapReached", "msg": "Hard cap reached" },
    { "code": 6006, "name": "SoftCapNotMet", "msg": "Soft cap not met, presale failed" },
    { "code": 6007, "name": "NotFinalized", "msg": "Presale is not finalized yet" },
    { "code": 6008, "name": "AlreadyFinalized", "msg": "Presale already finalized" },
    { "code": 6009, "name": "NotWhitelisted", "msg": "Not whitelisted for private sale" },
    { "code": 6010, "name": "NoTokensToClaim", "msg": "No tokens to claim" },
    { "code": 6011, "name": "VestingLocked", "msg": "Vesting period not reached" },
    { "code": 6012, "name": "InvalidConfig", "msg": "Invalid presale configuration" },
    { "code": 6013, "name": "Unauthorized", "msg": "Unauthorized access" },
    { "code": 6014, "name": "ArithmeticOverflow", "msg": "Arithmetic overflow" },
    { "code": 6015, "name": "InvalidTimestamp", "msg": "Invalid timestamp" },
    { "code": 6016, "name": "CannotUpdateFinalized", "msg": "Cannot update finalized presale" },
    { "code": 6017, "name": "InsufficientTokens", "msg": "Insufficient tokens in vault" }
  ]
};

export const LAUNCHPAD_PROGRAM_ID = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS";
