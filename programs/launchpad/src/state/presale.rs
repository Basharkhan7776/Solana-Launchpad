use anchor_lang::prelude::*;

#[account]
pub struct Presale {
    /// Authority who can manage the presale
    pub authority: Pubkey,

    /// Token mint address for the presale
    pub token_mint: Pubkey,

    /// Vault to store tokens
    pub presale_vault: Pubkey,

    /// Payment token mint (use system program pubkey for SOL)
    pub payment_mint: Pubkey,

    /// Minimum funding goal (soft cap)
    pub soft_cap: u64,

    /// Maximum funding goal (hard cap)
    pub hard_cap: u64,

    /// Minimum contribution amount
    pub min_contribution: u64,

    /// Maximum contribution per wallet
    pub max_contribution: u64,

    /// Token price in smallest unit (e.g., lamports for SOL)
    pub token_price: u64,

    /// Total tokens sold
    pub tokens_sold: u64,

    /// Total amount raised
    pub total_raised: u64,

    /// Presale start time (Unix timestamp)
    pub start_time: i64,

    /// Presale end time (Unix timestamp)
    pub end_time: i64,

    /// Whether vesting is enabled
    pub vesting_enabled: bool,

    /// Cliff period in seconds
    pub vesting_cliff: i64,

    /// Total vesting duration in seconds
    pub vesting_duration: i64,

    /// Whether whitelist is required
    pub is_whitelisted: bool,

    /// Whether presale is finalized
    pub is_finalized: bool,

    /// Whether presale is paused
    pub is_paused: bool,

    /// PDA bump
    pub bump: u8,
}

impl Presale {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        32 + // token_mint
        32 + // presale_vault
        32 + // payment_mint
        8 + // soft_cap
        8 + // hard_cap
        8 + // min_contribution
        8 + // max_contribution
        8 + // token_price
        8 + // tokens_sold
        8 + // total_raised
        8 + // start_time
        8 + // end_time
        1 + // vesting_enabled
        8 + // vesting_cliff
        8 + // vesting_duration
        1 + // is_whitelisted
        1 + // is_finalized
        1 + // is_paused
        1; // bump

    pub fn is_active(&self, clock: &Clock) -> bool {
        let current_time = clock.unix_timestamp;
        !self.is_paused
            && !self.is_finalized
            && current_time >= self.start_time
            && current_time <= self.end_time
            && self.total_raised < self.hard_cap
    }

    pub fn has_started(&self, clock: &Clock) -> bool {
        clock.unix_timestamp >= self.start_time
    }

    pub fn has_ended(&self, clock: &Clock) -> bool {
        clock.unix_timestamp > self.end_time
    }

    pub fn is_successful(&self) -> bool {
        self.total_raised >= self.soft_cap
    }
}

#[account]
pub struct Whitelist {
    /// The presale this whitelist belongs to
    pub presale: Pubkey,

    /// The whitelisted user
    pub user: Pubkey,

    /// PDA bump
    pub bump: u8,
}

impl Whitelist {
    pub const LEN: usize = 8 + // discriminator
        32 + // presale
        32 + // user
        1; // bump
}
