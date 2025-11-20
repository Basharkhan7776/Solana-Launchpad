use anchor_lang::prelude::*;

use crate::state::Presale;
use crate::errors::LaunchpadError;

#[derive(Accounts)]
pub struct UpdatePresale<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub presale: Account<'info, Presale>,

    pub authority: Signer<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UpdatePresaleParams {
    pub soft_cap: Option<u64>,
    pub hard_cap: Option<u64>,
    pub min_contribution: Option<u64>,
    pub max_contribution: Option<u64>,
    pub end_time: Option<i64>,
    pub is_paused: Option<bool>,
}

pub fn handler(ctx: Context<UpdatePresale>, params: UpdatePresaleParams) -> Result<()> {
    let presale = &mut ctx.accounts.presale;
    let clock = Clock::get()?;

    // Cannot update finalized presale
    require!(!presale.is_finalized, LaunchpadError::CannotUpdateFinalized);

    // Update fields if provided
    if let Some(soft_cap) = params.soft_cap {
        require!(soft_cap < presale.hard_cap, LaunchpadError::InvalidConfig);
        presale.soft_cap = soft_cap;
    }

    if let Some(hard_cap) = params.hard_cap {
        require!(hard_cap > presale.soft_cap, LaunchpadError::InvalidConfig);
        require!(hard_cap >= presale.total_raised, LaunchpadError::InvalidConfig);
        presale.hard_cap = hard_cap;
    }

    if let Some(min_contribution) = params.min_contribution {
        presale.min_contribution = min_contribution;
    }

    if let Some(max_contribution) = params.max_contribution {
        require!(
            max_contribution >= presale.min_contribution,
            LaunchpadError::InvalidConfig
        );
        presale.max_contribution = max_contribution;
    }

    if let Some(end_time) = params.end_time {
        require!(end_time > clock.unix_timestamp, LaunchpadError::InvalidTimestamp);
        require!(end_time > presale.start_time, LaunchpadError::InvalidTimestamp);
        presale.end_time = end_time;
    }

    if let Some(is_paused) = params.is_paused {
        presale.is_paused = is_paused;
        msg!("Presale pause status updated: {}", is_paused);
    }

    msg!("Presale updated successfully!");

    Ok(())
}
