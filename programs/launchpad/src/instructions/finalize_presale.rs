use anchor_lang::prelude::*;

use crate::state::Presale;
use crate::errors::LaunchpadError;

#[derive(Accounts)]
pub struct FinalizePresale<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub presale: Account<'info, Presale>,

    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<FinalizePresale>) -> Result<()> {
    let presale = &mut ctx.accounts.presale;
    let clock = Clock::get()?;

    // Validate presale can be finalized
    require!(!presale.is_finalized, LaunchpadError::AlreadyFinalized);
    require!(presale.has_ended(&clock), LaunchpadError::PresaleNotStarted);

    // Mark as finalized
    presale.is_finalized = true;

    if presale.is_successful() {
        msg!("Presale finalized successfully!");
        msg!("Total raised: {}", presale.total_raised);
        msg!("Tokens sold: {}", presale.tokens_sold);
    } else {
        msg!("Presale finalized - Soft cap not met");
        msg!("Contributors can now claim refunds");
    }

    Ok(())
}
