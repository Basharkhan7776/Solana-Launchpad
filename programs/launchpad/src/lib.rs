use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod launchpad {
    use super::*;

    pub fn initialize_presale(
        ctx: Context<InitializePresale>,
        presale_id: String,
        params: InitializePresaleParams,
    ) -> Result<()> {
        instructions::initialize_presale::handler(ctx, presale_id, params)
    }

    pub fn contribute(ctx: Context<Contribute>, amount: u64) -> Result<()> {
        instructions::contribute::handler(ctx, amount)
    }

    pub fn claim_tokens(ctx: Context<ClaimTokens>) -> Result<()> {
        instructions::claim_tokens::handler(ctx)
    }

    pub fn finalize_presale(ctx: Context<FinalizePresale>) -> Result<()> {
        instructions::finalize_presale::handler(ctx)
    }

    pub fn withdraw_funds(ctx: Context<WithdrawFunds>) -> Result<()> {
        instructions::withdraw_funds::handler(ctx)
    }

    pub fn refund(ctx: Context<Refund>) -> Result<()> {
        instructions::refund::handler(ctx)
    }

    pub fn add_to_whitelist(ctx: Context<AddToWhitelist>) -> Result<()> {
        instructions::manage_whitelist::add_to_whitelist(ctx)
    }

    pub fn remove_from_whitelist(ctx: Context<RemoveFromWhitelist>) -> Result<()> {
        instructions::manage_whitelist::remove_from_whitelist(ctx)
    }

    pub fn update_presale(
        ctx: Context<UpdatePresale>,
        params: UpdatePresaleParams,
    ) -> Result<()> {
        instructions::update_presale::handler(ctx, params)
    }
}
