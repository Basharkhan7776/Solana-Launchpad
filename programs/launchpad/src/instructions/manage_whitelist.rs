use anchor_lang::prelude::*;

use crate::state::{Presale, Whitelist};
use crate::errors::LaunchpadError;

#[derive(Accounts)]
pub struct AddToWhitelist<'info> {
    #[account(
        has_one = authority,
        constraint = presale.is_whitelisted @ LaunchpadError::InvalidConfig,
    )]
    pub presale: Account<'info, Presale>,

    #[account(
        init,
        payer = authority,
        space = Whitelist::LEN,
        seeds = [b"whitelist", presale.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub whitelist: Account<'info, Whitelist>,

    /// CHECK: The user to be whitelisted
    pub user: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn add_to_whitelist(ctx: Context<AddToWhitelist>) -> Result<()> {
    let whitelist = &mut ctx.accounts.whitelist;

    whitelist.presale = ctx.accounts.presale.key();
    whitelist.user = ctx.accounts.user.key();
    whitelist.bump = ctx.bumps.whitelist;

    msg!("User added to whitelist!");
    msg!("Presale: {}", whitelist.presale);
    msg!("User: {}", whitelist.user);

    Ok(())
}

#[derive(Accounts)]
pub struct RemoveFromWhitelist<'info> {
    #[account(
        has_one = authority,
    )]
    pub presale: Account<'info, Presale>,

    #[account(
        mut,
        close = authority,
        seeds = [b"whitelist", presale.key().as_ref(), user.key().as_ref()],
        bump = whitelist.bump,
    )]
    pub whitelist: Account<'info, Whitelist>,

    /// CHECK: The user to be removed from whitelist
    pub user: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn remove_from_whitelist(ctx: Context<RemoveFromWhitelist>) -> Result<()> {
    msg!("User removed from whitelist!");
    msg!("Presale: {}", ctx.accounts.presale.key());
    msg!("User: {}", ctx.accounts.user.key());

    Ok(())
}
