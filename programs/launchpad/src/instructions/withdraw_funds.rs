use anchor_lang::prelude::*;

use crate::state::Presale;
use crate::errors::LaunchpadError;

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub presale: Account<'info, Presale>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<WithdrawFunds>) -> Result<()> {
    let presale = &ctx.accounts.presale;

    // Validate presale is finalized and successful
    require!(presale.is_finalized, LaunchpadError::NotFinalized);
    require!(presale.is_successful(), LaunchpadError::SoftCapNotMet);

    // Funds are already in authority's wallet from contributions
    // This instruction is mainly for event logging and state verification

    msg!("Withdrawal confirmation - Funds available");
    msg!("Authority: {}", ctx.accounts.authority.key());
    msg!("Amount raised: {}", presale.total_raised);

    Ok(())
}
