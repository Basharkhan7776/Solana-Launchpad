use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::state::Presale;
use crate::errors::LaunchpadError;

#[derive(Accounts)]
#[instruction(presale_id: String)]
pub struct InitializePresale<'info> {
    #[account(
        init,
        payer = authority,
        space = Presale::LEN,
        seeds = [b"presale", authority.key().as_ref(), presale_id.as_bytes()],
        bump
    )]
    pub presale: Account<'info, Presale>,

    #[account(mut)]
    pub authority: Signer<'info>,

    /// Token to be sold in presale
    pub token_mint: Account<'info, Mint>,

    /// Vault to hold presale tokens
    #[account(
        init,
        payer = authority,
        token::mint = token_mint,
        token::authority = presale,
        seeds = [b"vault", presale.key().as_ref()],
        bump
    )]
    pub presale_vault: Account<'info, TokenAccount>,

    /// Payment mint (system program for SOL, or SPL token)
    pub payment_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct InitializePresaleParams {
    pub soft_cap: u64,
    pub hard_cap: u64,
    pub min_contribution: u64,
    pub max_contribution: u64,
    pub token_price: u64,
    pub start_time: i64,
    pub end_time: i64,
    pub vesting_enabled: bool,
    pub vesting_cliff: i64,
    pub vesting_duration: i64,
    pub is_whitelisted: bool,
}

pub fn handler(
    ctx: Context<InitializePresale>,
    _presale_id: String,
    params: InitializePresaleParams,
) -> Result<()> {
    let presale = &mut ctx.accounts.presale;
    let clock = Clock::get()?;

    // Validate parameters
    require!(params.hard_cap > params.soft_cap, LaunchpadError::InvalidConfig);
    require!(params.max_contribution >= params.min_contribution, LaunchpadError::InvalidConfig);
    require!(params.end_time > params.start_time, LaunchpadError::InvalidTimestamp);
    require!(params.start_time >= clock.unix_timestamp, LaunchpadError::InvalidTimestamp);
    require!(params.token_price > 0, LaunchpadError::InvalidConfig);

    if params.vesting_enabled {
        require!(params.vesting_duration > 0, LaunchpadError::InvalidConfig);
        require!(params.vesting_cliff <= params.vesting_duration, LaunchpadError::InvalidConfig);
    }

    // Initialize presale
    presale.authority = ctx.accounts.authority.key();
    presale.token_mint = ctx.accounts.token_mint.key();
    presale.presale_vault = ctx.accounts.presale_vault.key();
    presale.payment_mint = ctx.accounts.payment_mint.key();
    presale.soft_cap = params.soft_cap;
    presale.hard_cap = params.hard_cap;
    presale.min_contribution = params.min_contribution;
    presale.max_contribution = params.max_contribution;
    presale.token_price = params.token_price;
    presale.tokens_sold = 0;
    presale.total_raised = 0;
    presale.start_time = params.start_time;
    presale.end_time = params.end_time;
    presale.vesting_enabled = params.vesting_enabled;
    presale.vesting_cliff = params.vesting_cliff;
    presale.vesting_duration = params.vesting_duration;
    presale.is_whitelisted = params.is_whitelisted;
    presale.is_finalized = false;
    presale.is_paused = false;
    presale.bump = ctx.bumps.presale;

    msg!("Presale initialized successfully!");
    msg!("Presale: {}", presale.key());
    msg!("Token: {}", presale.token_mint);
    msg!("Hard Cap: {}", presale.hard_cap);
    msg!("Token Price: {}", presale.token_price);

    Ok(())
}
