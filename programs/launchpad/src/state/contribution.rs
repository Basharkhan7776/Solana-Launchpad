use anchor_lang::prelude::*;

#[account]
pub struct Contribution {
    /// The presale this contribution belongs to
    pub presale: Pubkey,

    /// The contributor's wallet
    pub contributor: Pubkey,

    /// Amount paid by contributor
    pub amount_paid: u64,

    /// Tokens allocated to contributor
    pub tokens_allocated: u64,

    /// Tokens already claimed
    pub tokens_claimed: u64,

    /// Last claim timestamp
    pub last_claim_time: i64,

    /// PDA bump
    pub bump: u8,
}

impl Contribution {
    pub const LEN: usize = 8 + // discriminator
        32 + // presale
        32 + // contributor
        8 + // amount_paid
        8 + // tokens_allocated
        8 + // tokens_claimed
        8 + // last_claim_time
        1; // bump

    pub fn get_claimable_amount(&self, presale_start: i64, vesting_cliff: i64, vesting_duration: i64, current_time: i64) -> Result<u64> {
        if vesting_duration == 0 {
            // No vesting, all tokens claimable at once
            return Ok(self.tokens_allocated.saturating_sub(self.tokens_claimed));
        }

        let cliff_end = presale_start.saturating_add(vesting_cliff);

        // If still in cliff period, nothing is claimable
        if current_time < cliff_end {
            return Ok(0);
        }

        let vesting_end = presale_start.saturating_add(vesting_duration);

        // After vesting period, all tokens are claimable
        if current_time >= vesting_end {
            return Ok(self.tokens_allocated.saturating_sub(self.tokens_claimed));
        }

        // Linear vesting calculation
        let time_since_start = (current_time - presale_start) as u128;
        let total_duration = vesting_duration as u128;
        let allocated = self.tokens_allocated as u128;

        let vested = (allocated * time_since_start) / total_duration;
        let claimable = (vested as u64).saturating_sub(self.tokens_claimed);

        Ok(claimable)
    }
}
