use anchor_lang::prelude::*;

#[account]
pub struct StakingPool {
    pub authority: Pubkey,
    pub stake_mint: Pubkey,
    pub reward_mint: Pubkey,
    pub vault: Pubkey,
    pub reward_rate: u64,
    pub total_staked: u64,
    pub min_lock_duration: i64,
    pub bump: u8,
}

#[account]
pub struct StakeAccount {
    pub pool: Pubkey,
    pub owner: Pubkey,
    pub amount_staked: u64,
    pub rewards_earned: u64,
    pub last_claim_time: i64,
    pub stake_time: i64,
    pub bump: u8,
}
