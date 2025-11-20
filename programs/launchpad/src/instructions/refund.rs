use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

use crate::state::{Contribution, Presale};
use crate::errors::LaunchpadError;

#[derive(Accounts)]
pub struct Refund<'info> {
    #[account(
        has_one = authority,
    )]
    pub presale: Account<'info, Presale>,

    #[account(
        mut,
        seeds = [b"contribution", presale.key().as_ref(), contributor.key().as_ref()],
        bump = contribution.bump,
        has_one = presale,
        has_one = contributor,
    )]
    pub contribution: Account<'info, Contribution>,

    #[account(mut)]
    pub contributor: SystemAccount<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Refund>) -> Result<()> {
    let presale = &ctx.accounts.presale;
    let contribution = &mut ctx.accounts.contribution;

    // Validate presale is finalized but failed to meet soft cap
    require!(presale.is_finalized, LaunchpadError::NotFinalized);
    require!(!presale.is_successful(), LaunchpadError::InvalidConfig);

    let refund_amount = contribution.amount_paid;
    require!(refund_amount > 0, LaunchpadError::NoTokensToClaim);

    // Transfer refund from authority back to contributor
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        Transfer {
            from: ctx.accounts.authority.to_account_info(),
            to: ctx.accounts.contributor.to_account_info(),
        },
    );
    transfer(cpi_context, refund_amount)?;

    // Mark contribution as refunded
    contribution.amount_paid = 0;
    contribution.tokens_allocated = 0;

    msg!("Refund processed successfully!");
    msg!("Contributor: {}", ctx.accounts.contributor.key());
    msg!("Refund amount: {}", refund_amount);

    Ok(())
}
