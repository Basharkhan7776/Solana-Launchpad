use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer as SplTransfer};

use crate::state::{Contribution, Presale};
use crate::errors::LaunchpadError;

#[derive(Accounts)]
pub struct ClaimTokens<'info> {
    #[account(
        seeds = [b"presale", presale.authority.as_ref(), presale.key().as_ref()[..8].try_into().unwrap()],
        bump = presale.bump,
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

    #[account(
        mut,
        seeds = [b"vault", presale.key().as_ref()],
        bump,
    )]
    pub presale_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = contributor_token_account.mint == presale.token_mint,
        constraint = contributor_token_account.owner == contributor.key(),
    )]
    pub contributor_token_account: Account<'info, TokenAccount>,

    pub contributor: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<ClaimTokens>) -> Result<()> {
    let presale = &ctx.accounts.presale;
    let contribution = &mut ctx.accounts.contribution;
    let clock = Clock::get()?;

    // Validate presale is finalized and successful
    require!(presale.is_finalized, LaunchpadError::NotFinalized);
    require!(presale.is_successful(), LaunchpadError::SoftCapNotMet);

    // Calculate claimable amount
    let claimable = if presale.vesting_enabled {
        contribution.get_claimable_amount(
            presale.end_time,
            presale.vesting_cliff,
            presale.vesting_duration,
            clock.unix_timestamp,
        )?
    } else {
        contribution.tokens_allocated.saturating_sub(contribution.tokens_claimed)
    };

    require!(claimable > 0, LaunchpadError::NoTokensToClaim);

    // Transfer tokens from vault to contributor
    let presale_key = presale.key();
    let seeds = &[
        b"presale",
        presale.authority.as_ref(),
        &presale_key.to_bytes()[..8],
        &[presale.bump],
    ];
    let signer = &[&seeds[..]];

    let cpi_accounts = SplTransfer {
        from: ctx.accounts.presale_vault.to_account_info(),
        to: ctx.accounts.contributor_token_account.to_account_info(),
        authority: presale.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

    token::transfer(cpi_ctx, claimable)?;

    // Update contribution
    contribution.tokens_claimed = contribution.tokens_claimed.checked_add(claimable)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;
    contribution.last_claim_time = clock.unix_timestamp;

    msg!("Tokens claimed successfully!");
    msg!("Contributor: {}", ctx.accounts.contributor.key());
    msg!("Amount claimed: {}", claimable);
    msg!("Total claimed: {}", contribution.tokens_claimed);

    Ok(())
}
