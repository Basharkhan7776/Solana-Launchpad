use anchor_lang::prelude::*;

#[account]
pub struct Marketplace {
    pub authority: Pubkey,
    pub treasury: Pubkey,
    pub fee_percentage: u16,
    pub total_sales: u64,
    pub total_volume: u64,
    pub bump: u8,
}

#[account]
pub struct Listing {
    pub marketplace: Pubkey,
    pub seller: Pubkey,
    pub nft_mint: Pubkey,
    pub price: u64,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}
