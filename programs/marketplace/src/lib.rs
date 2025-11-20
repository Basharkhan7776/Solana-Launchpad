use anchor_lang::prelude::*;

declare_id!("MKTPLcXGvjxPNCK6G5FoRFx3Nzs9J8vZwq9X2YLBVhpN");

pub mod state;
pub mod instructions;

use state::*;

#[program]
pub mod marketplace {
    use super::*;

    pub fn initialize_marketplace(
        ctx: Context<InitializeMarketplace>,
        fee_percentage: u16,
    ) -> Result<()> {
        let marketplace = &mut ctx.accounts.marketplace;
        marketplace.authority = ctx.accounts.authority.key();
        marketplace.treasury = ctx.accounts.treasury.key();
        marketplace.fee_percentage = fee_percentage;
        marketplace.total_sales = 0;
        marketplace.total_volume = 0;
        marketplace.bump = ctx.bumps.marketplace;
        Ok(())
    }

    pub fn list_nft(
        ctx: Context<ListNft>,
        price: u64,
    ) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        listing.marketplace = ctx.accounts.marketplace.key();
        listing.seller = ctx.accounts.seller.key();
        listing.nft_mint = ctx.accounts.nft_mint.key();
        listing.price = price;
        listing.is_active = true;
        listing.created_at = Clock::get()?.unix_timestamp;
        listing.bump = ctx.bumps.listing;
        Ok(())
    }

    pub fn buy_nft(ctx: Context<BuyNft>) -> Result<()> {
        // Implementation for buying NFT
        // Transfer SOL from buyer to seller (minus marketplace fee)
        // Transfer NFT from seller to buyer
        // Close listing account
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeMarketplace<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 2 + 8 + 8 + 1,
        seeds = [b"marketplace"],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,

    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: Treasury account
    pub treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ListNft<'info> {
    pub marketplace: Account<'info, Marketplace>,

    #[account(
        init,
        payer = seller,
        space = 8 + 32 + 32 + 32 + 8 + 1 + 8 + 1,
        seeds = [b"listing", nft_mint.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, Listing>,

    /// CHECK: NFT mint
    pub nft_mint: AccountInfo<'info>,

    #[account(mut)]
    pub seller: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyNft<'info> {
    pub marketplace: Account<'info, Marketplace>,

    #[account(mut, close = seller)]
    pub listing: Account<'info, Listing>,

    #[account(mut)]
    pub seller: SystemAccount<'info>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
