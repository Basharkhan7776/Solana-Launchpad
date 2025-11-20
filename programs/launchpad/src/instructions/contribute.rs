use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};
use anchor_spl::token::{Token, TokenAccount};

use crate::state::{Contribution, Presale, Whitelist};
use crate::errors::LaunchpadError;

#[derive(Accounts)]
pub struct Contribute<'info> {
    #[account(mut)]
    pub presale: Account<'info, Presale>,

    #[account(
        init_if_needed,
        payer = contributor,
        space = Contribution::LEN,
        seeds = [b"contribution", presale.key().as_ref(), contributor.key().as_ref()],
        bump
    )]
    pub contribution: Account<'info, Contribution>,

    /// Whitelist account (only checked if presale is whitelisted)
    #[account(
        seeds = [b"whitelist", presale.key().as_ref(), contributor.key().as_ref()],
        bump = whitelist.bump,
    )]
    pub whitelist: Option<Account<'info, Whitelist>>,

    #[account(mut)]
    pub contributor: Signer<'info>,

    /// Treasury to receive contributions (authority's wallet)
    #[account(mut, address = presale.authority)]
    pub treasury: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<Contribute>, amount: u64) -> Result<()> {
    let presale = &mut ctx.accounts.presale;
    let contribution = &mut ctx.accounts.contribution;
    let clock = Clock::get()?;

    // Validate presale is active
    require!(!presale.is_paused, LaunchpadError::PresalePaused);
    require!(presale.has_started(&clock), LaunchpadError::PresaleNotStarted);
    require!(!presale.has_ended(&clock), LaunchpadError::PresaleEnded);
    require!(!presale.is_finalized, LaunchpadError::AlreadyFinalized);

    // Check whitelist if required
    if presale.is_whitelisted {
        require!(ctx.accounts.whitelist.is_some(), LaunchpadError::NotWhitelisted);
    }

    // Validate contribution amount
    require!(amount >= presale.min_contribution, LaunchpadError::BelowMinContribution);

    let current_contribution = contribution.amount_paid.checked_add(amount)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;

    require!(
        current_contribution <= presale.max_contribution,
        LaunchpadError::ExceedsMaxContribution
    );

    let new_total_raised = presale.total_raised.checked_add(amount)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;

    require!(new_total_raised <= presale.hard_cap, LaunchpadError::HardCapReached);

    // Calculate tokens to allocate
    let tokens_to_allocate = amount.checked_mul(presale.token_price)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;

    // Transfer payment to treasury
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        Transfer {
            from: ctx.accounts.contributor.to_account_info(),
            to: ctx.accounts.treasury.to_account_info(),
        },
    );
    transfer(cpi_context, amount)?;

    // Update contribution
    if contribution.presale == Pubkey::default() {
        contribution.presale = presale.key();
        contribution.contributor = ctx.accounts.contributor.key();
        contribution.amount_paid = 0;
        contribution.tokens_allocated = 0;
        contribution.tokens_claimed = 0;
        contribution.last_claim_time = 0;
        contribution.bump = ctx.bumps.contribution;
    }

    contribution.amount_paid = contribution.amount_paid.checked_add(amount)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;
    contribution.tokens_allocated = contribution.tokens_allocated.checked_add(tokens_to_allocate)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;

    // Update presale
    presale.total_raised = new_total_raised;
    presale.tokens_sold = presale.tokens_sold.checked_add(tokens_to_allocate)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;

    msg!("Contribution successful!");
    msg!("Contributor: {}", ctx.accounts.contributor.key());
    msg!("Amount: {}", amount);
    msg!("Tokens allocated: {}", tokens_to_allocate);
    msg!("Total raised: {}", presale.total_raised);

    Ok(())
}
