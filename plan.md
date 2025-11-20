# Solana Launchpad - Development Plan

This document outlines the phased development approach for the Solana Launchpad platform, a comprehensive dApp for token creation, NFT management, trading, and DeFi features on Solana.

---

## 🎯 Project Overview

**SolSoil** is a full-featured Solana launchpad that enables users to:
- Create and manage SPL tokens
- Launch token presales and ICOs
- Mint and manage NFTs and collections
- Trade tokens through integrated DEX
- Participate in DeFi activities (staking, liquidity provision)

---

## ✅ Phase 1-2: Foundation (Completed)

### Status: **COMPLETED** ✓

### Features Implemented:
- **Wallet Integration**
  - Multi-wallet support (Phantom, Solflare, etc.) via Solana Wallet Adapter
  - Network switching (Mainnet, Devnet, Testnet)
  - Dark/Light theme toggle

- **Basic Wallet Operations**
  - Show wallet balance with auto-refresh
  - Send SOL tokens to other wallets
  - Request airdrops on Devnet/Testnet
  - Sign messages cryptographically

- **Token Creation (Token-2022)**
  - Create custom SPL tokens with metadata
  - Configure token name, symbol, decimals, and supply
  - Image upload via Cloudinary integration
  - Metadata pointer extension
  - Automatic Associated Token Account (ATA) creation
  - Initial token minting to creator wallet

- **UI/UX Foundation**
  - Responsive design with TailwindCSS 4
  - Animated components with Framer Motion
  - Radix UI component library integration
  - Toast notifications for user feedback

### Tech Stack:
- Frontend: Next.js 15 (App Router), React 19, TypeScript
- Blockchain: Solana Web3.js, SPL Token, Token-2022
- Styling: TailwindCSS 4, Radix UI, Framer Motion
- State Management: Redux Toolkit
- Package Manager: Bun

---

## 🚀 Phase 3: Token Swap & NFT Studio (Completed)

### Status: **COMPLETED** ✓

### Features Implemented:

#### 1. Token Swap (`/swap`)
- **Jupiter Aggregator Integration**
  - Best price routing across Solana DEXs
  - Token search and selection
  - Real-time price quotes and slippage settings
  - Swap execution with transaction confirmation
  - Swap history tracking

- **Features**:
  - Input/Output token selection
  - Balance display and max amount button
  - Slippage tolerance configuration
  - Price impact warnings
  - Route information display

#### 2. NFT Studio (`/nfts`)
Complete NFT management suite with four core components:

- **NFT Mint** (`components/NftMint.tsx`)
  - Single NFT minting
  - Upload image via Cloudinary
  - Set name, symbol, description, and attributes
  - Royalty configuration
  - Creator verification
  - On-chain metadata storage

- **NFT Collection** (`components/NftCollection.tsx`)
  - Create verified NFT collections
  - Collection metadata and branding
  - Set collection authority
  - Update authority management
  - Collection verification

- **NFT Gallery** (`components/NftGallery.tsx`)
  - View all owned NFTs
  - Display NFT metadata and images
  - Filter and search functionality
  - Responsive grid layout
  - NFT detail modal view
  - Transfer and burn capabilities

- **NFT Bulk Mint** (`components/NftBulkMint.tsx`)
  - Batch minting multiple NFTs
  - CSV upload for bulk metadata
  - Progress tracking
  - Error handling for individual mints
  - Collection assignment for bulk mints

#### 3. Token Management
- **Token List** (`components/TokenList.tsx`)
  - Display all owned SPL tokens
  - Token balances and metadata
  - Token search and filtering
  - Price information (if available)

- **Mint More** (`components/MintMore.tsx`)
  - Mint additional supply to existing tokens
  - Authority verification
  - Batch minting support

#### 4. Navigation & UX
- **Table of Contents** (`components/TableOfContents.tsx`)
  - Jump navigation to all features
  - Smooth scrolling
  - Active section highlighting

- **Connection Navbar** (`components/ConnectionNavbar.tsx`)
  - Quick network switcher
  - Connection status indicator

#### 5. API Routes
- **Image Upload** (`app/api/upload/image/route.ts`)
  - Cloudinary integration for NFT images
  - Server-side upload handling
  - Signature generation for secure uploads

- **Metadata Upload** (`app/api/upload/metadata/route.ts`)
  - JSON metadata storage
  - Cloudinary-based metadata hosting
  - NFT standard compliance

### Files Added/Modified:
- `app/swap/page.tsx` - Token swap interface
- `app/nfts/page.tsx` - NFT studio page
- `components/swap/SwapInterface.tsx` - Jupiter swap component
- `components/NftMint.tsx`, `NftCollection.tsx`, `NftGallery.tsx`, `NftBulkMint.tsx`
- `components/TokenList.tsx`, `MintMore.tsx`, `TableOfContents.tsx`
- `lib/jupiter.ts` - Jupiter API integration
- `lib/tokenMetadata.ts` - Token metadata utilities

---

## 🔥 Phase 4: Presale, ICO & Launchpad Contracts

### Status: **IN PROGRESS** 🚧

### Objective:
Implement Anchor smart contracts for token presales, ICOs, and launchpad features with a comprehensive frontend interface.

### 4.1 Anchor Program Setup

#### Program Structure:
```
programs/
└── launchpad/
    ├── Cargo.toml
    └── src/
        ├── lib.rs              # Main program entry
        ├── instructions/       # All instructions
        │   ├── mod.rs
        │   ├── initialize_presale.rs
        │   ├── contribute.rs
        │   ├── claim_tokens.rs
        │   ├── finalize_presale.rs
        │   └── withdraw_funds.rs
        ├── state/              # Account structures
        │   ├── mod.rs
        │   ├── presale.rs
        │   └── contribution.rs
        └── errors.rs           # Custom errors
```

#### Core Smart Contracts:

**1. Presale Contract**
- **Features**:
  - Configure presale parameters (soft cap, hard cap, min/max contribution)
  - Whitelist management for private sales
  - Time-based presale stages (private, public)
  - Automatic refund if soft cap not met
  - Token distribution on success
  - Emergency pause functionality
  - Owner withdrawal after successful presale

- **Instructions**:
  - `initialize_presale` - Create new presale
  - `contribute` - User contribution (SOL or SPL tokens)
  - `claim_tokens` - Claim purchased tokens
  - `finalize_presale` - Close presale and enable claims
  - `withdraw_funds` - Owner withdraws raised funds
  - `refund` - Refund contributors if soft cap not met
  - `add_to_whitelist` - Add addresses to whitelist
  - `update_presale` - Modify presale parameters
  - `pause_presale` - Emergency pause

- **Accounts**:
  ```rust
  pub struct Presale {
      pub authority: Pubkey,
      pub token_mint: Pubkey,
      pub presale_vault: Pubkey,
      pub payment_mint: Pubkey,  // SOL or SPL token
      pub soft_cap: u64,
      pub hard_cap: u64,
      pub min_contribution: u64,
      pub max_contribution: u64,
      pub token_price: u64,      // Price in lamports/smallest unit
      pub tokens_sold: u64,
      pub total_raised: u64,
      pub start_time: i64,
      pub end_time: i64,
      pub vesting_enabled: bool,
      pub vesting_cliff: i64,    // Cliff period in seconds
      pub vesting_duration: i64, // Total vesting duration
      pub is_whitelisted: bool,
      pub is_finalized: bool,
      pub is_paused: bool,
      pub bump: u8,
  }

  pub struct Contribution {
      pub presale: Pubkey,
      pub contributor: Pubkey,
      pub amount_paid: u64,
      pub tokens_allocated: u64,
      pub tokens_claimed: u64,
      pub last_claim_time: i64,
      pub bump: u8,
  }
  ```

**2. Vesting Contract**
- **Features**:
  - Linear vesting with cliff period
  - Token lockup schedules
  - Partial claim support
  - Team/advisor token vesting
  - Integration with presale contract

- **Instructions**:
  - `create_vesting_schedule`
  - `claim_vested_tokens`
  - `revoke_vesting` (by authority)

**3. Liquidity Lock Contract**
- **Features**:
  - Lock LP tokens for specified duration
  - Time-locked withdrawals
  - Multiple lock periods support
  - Transparent lock verification

### 4.2 Frontend Implementation

#### New Pages:
1. **Launchpad Dashboard** (`app/launchpad/page.tsx`)
   - View all active presales
   - Filter by status (upcoming, active, ended)
   - Sort by raised amount, time remaining
   - Featured projects carousel
   - Statistics overview

2. **Create Presale** (`app/launchpad/create/page.tsx`)
   - Presale configuration form
   - Token selection
   - Set caps, dates, pricing
   - Whitelist management
   - Vesting configuration
   - Preview and deploy

3. **Presale Details** (`app/launchpad/[id]/page.tsx`)
   - Presale information display
   - Progress bars (raised, time remaining)
   - Contribution interface
   - Token claim section
   - Transaction history
   - Project details and links

4. **My Contributions** (`app/launchpad/my-contributions/page.tsx`)
   - List all user contributions
   - Claimable tokens overview
   - Vesting schedules
   - Claim interface

#### New Components:
- `components/launchpad/PresaleCard.tsx` - Individual presale card
- `components/launchpad/PresaleForm.tsx` - Create presale form
- `components/launchpad/ContributeModal.tsx` - Contribution interface
- `components/launchpad/ClaimTokens.tsx` - Token claiming
- `components/launchpad/PresaleStats.tsx` - Statistics display
- `components/launchpad/VestingSchedule.tsx` - Vesting timeline
- `components/launchpad/WhitelistManager.tsx` - Manage whitelist
- `components/launchpad/PresaleList.tsx` - Presale listing
- `components/launchpad/CountdownTimer.tsx` - Time remaining

#### SDK Integration:
- `lib/anchor/launchpad.ts` - Anchor client setup
- `lib/anchor/instructions.ts` - Instruction builders
- `lib/anchor/utils.ts` - Helper functions
- `hooks/useLaunchpad.ts` - React hooks for launchpad
- `hooks/usePresale.ts` - Presale-specific hooks

### 4.3 Testing
- Unit tests for all Anchor instructions
- Integration tests for complete presale lifecycle
- Frontend E2E tests with Playwright
- Devnet deployment and testing

### Deliverables:
- ✅ Anchor programs deployed on Devnet
- ✅ Complete presale lifecycle functionality
- ✅ Admin dashboard for presale management
- ✅ User-friendly contribution interface
- ✅ Comprehensive documentation
- ✅ Test coverage >80%

---

## 💎 Phase 5: Advanced DeFi & Marketplace

### Status: **PLANNED** 📋

### Objective:
Implement advanced features including NFT marketplace, staking, liquidity provision, and analytics.

### 5.1 NFT Marketplace

#### Smart Contracts (Anchor):
**Marketplace Program**
- **Features**:
  - List NFTs for sale (fixed price or auction)
  - Buy NFTs instantly
  - Make offers on NFTs
  - Auction system with bidding
  - Royalty enforcement
  - Platform fees

- **Instructions**:
  - `initialize_marketplace` - Setup marketplace
  - `list_nft` - List NFT for sale
  - `delist_nft` - Remove listing
  - `buy_nft` - Purchase NFT
  - `create_auction` - Start auction
  - `place_bid` - Bid on auction
  - `finalize_auction` - End auction
  - `make_offer` - Make offer on unlisted NFT
  - `accept_offer` - Accept offer
  - `update_listing` - Update price/details

- **Accounts**:
  ```rust
  pub struct Marketplace {
      pub authority: Pubkey,
      pub treasury: Pubkey,
      pub fee_percentage: u16,  // Basis points (e.g., 250 = 2.5%)
      pub total_sales: u64,
      pub total_volume: u64,
      pub bump: u8,
  }

  pub struct Listing {
      pub marketplace: Pubkey,
      pub seller: Pubkey,
      pub nft_mint: Pubkey,
      pub price: u64,
      pub listing_type: ListingType,  // FixedPrice, Auction
      pub is_active: bool,
      pub created_at: i64,
      pub bump: u8,
  }

  pub struct Auction {
      pub listing: Pubkey,
      pub highest_bidder: Pubkey,
      pub highest_bid: u64,
      pub min_bid_increment: u64,
      pub end_time: i64,
      pub finalized: bool,
  }
  ```

#### Frontend:
- **Marketplace Page** (`app/marketplace/page.tsx`)
  - Browse NFT listings
  - Filter by collection, price, rarity
  - Search functionality
  - Grid/List view toggle

- **NFT Details** (`app/marketplace/[mint]/page.tsx`)
  - NFT information and metadata
  - Ownership history
  - Buy/Bid interface
  - Make offer functionality
  - Related NFTs

- **My Listings** (`app/marketplace/my-listings/page.tsx`)
  - Manage active listings
  - View sales history
  - Analytics and insights

- **Components**:
  - `components/marketplace/NftCard.tsx`
  - `components/marketplace/ListNftModal.tsx`
  - `components/marketplace/BuyNftModal.tsx`
  - `components/marketplace/AuctionTimer.tsx`
  - `components/marketplace/BidHistory.tsx`

### 5.2 Staking Platform

#### Smart Contracts (Anchor):
**Staking Program**
- **Features**:
  - Stake SPL tokens
  - NFT staking
  - Configurable rewards (APY, fixed)
  - Lock periods with boosted rewards
  - Emergency unstake (with penalty)

- **Instructions**:
  - `initialize_staking_pool`
  - `stake_tokens`
  - `unstake_tokens`
  - `claim_rewards`
  - `stake_nft`
  - `unstake_nft`

- **Accounts**:
  ```rust
  pub struct StakingPool {
      pub authority: Pubkey,
      pub stake_mint: Pubkey,
      pub reward_mint: Pubkey,
      pub vault: Pubkey,
      pub reward_rate: u64,      // Rewards per second
      pub total_staked: u64,
      pub min_lock_duration: i64,
      pub penalty_percentage: u16,
      pub bump: u8,
  }

  pub struct StakeAccount {
      pub pool: Pubkey,
      pub owner: Pubkey,
      pub amount_staked: u64,
      pub rewards_earned: u64,
      pub last_claim_time: i64,
      pub stake_time: i64,
      pub lock_end_time: i64,
      pub bump: u8,
  }
  ```

#### Frontend:
- **Staking Dashboard** (`app/staking/page.tsx`)
  - Available staking pools
  - APY and TVL display
  - Stake/Unstake interface
  - Rewards calculator

- **My Stakes** (`app/staking/my-stakes/page.tsx`)
  - Active stakes overview
  - Claimable rewards
  - Staking history

### 5.3 Liquidity Provision

#### Integration:
- **Raydium Integration**
  - Create liquidity pools
  - Add/Remove liquidity
  - View LP token balance
  - Track impermanent loss

- **Components**:
  - `components/liquidity/CreatePool.tsx`
  - `components/liquidity/AddLiquidity.tsx`
  - `components/liquidity/RemoveLiquidity.tsx`
  - `components/liquidity/PoolStats.tsx`

### 5.4 Analytics Dashboard

#### Features:
- **Portfolio Overview**
  - Total portfolio value
  - Asset distribution chart
  - PnL tracking
  - Historical performance

- **Token Analytics**
  - Holder distribution
  - Transaction volume
  - Price charts
  - Liquidity metrics

- **NFT Analytics**
  - Collection floor prices
  - Trading volume
  - Rarity rankings
  - Trending collections

- **Pages**:
  - `app/analytics/page.tsx` - Main dashboard
  - `app/analytics/token/[mint]/page.tsx` - Token details
  - `app/analytics/nft/[collection]/page.tsx` - NFT collection stats

- **Components**:
  - `components/analytics/PortfolioChart.tsx`
  - `components/analytics/TokenChart.tsx`
  - `components/analytics/HolderDistribution.tsx`
  - `components/analytics/VolumeChart.tsx`

### 5.5 Additional Features

#### Governance (Optional)
- Create governance proposals
- Vote on proposals
- Token-weighted voting
- Timelock execution

#### Multi-Signature Support
- Multi-sig wallet creation
- Transaction proposals
- Approval workflow
- Signer management

### Deliverables:
- ✅ NFT marketplace with trading
- ✅ Staking platform for tokens and NFTs
- ✅ Liquidity pool management
- ✅ Comprehensive analytics
- ✅ Mobile-responsive design
- ✅ Performance optimization

---

## 📈 Success Metrics

### Phase 3:
- ✅ Jupiter swap integration functional
- ✅ NFT minting and collection creation working
- ✅ All components responsive and animated
- ✅ Zero critical bugs

### Phase 4:
- [ ] Presale contracts audited and secure
- [ ] At least 5 test presales on Devnet
- [ ] User feedback score > 4.5/5
- [ ] Gas optimization for all instructions

### Phase 5:
- [ ] 100+ NFTs listed on marketplace
- [ ] $10K+ total staking TVL
- [ ] 500+ active users
- [ ] <2s page load time

---

## 🔐 Security Considerations

### Smart Contract Security:
- Anchor framework best practices
- Reentrancy protection
- Integer overflow checks
- Access control modifiers
- PDA validation
- Account ownership verification
- Audit by reputable firm before mainnet

### Frontend Security:
- Input validation and sanitization
- Transaction simulation before signing
- Wallet connection best practices
- Rate limiting on API routes
- HTTPS enforcement
- No private key storage

---

## 🛠️ Tech Stack

### Current:
- **Frontend**: Next.js 15, React 19, TypeScript
- **Blockchain**: Solana Web3.js, SPL Token, Token-2022
- **Styling**: TailwindCSS 4, Radix UI, Framer Motion
- **State**: Redux Toolkit
- **Package Manager**: Bun
- **Image Hosting**: Cloudinary

### Phase 4-5 Additions:
- **Smart Contracts**: Anchor Framework 0.30+
- **Testing**: Anchor Test Suite, Mocha
- **Charts**: Recharts, Chart.js
- **Wallet**: Solana Wallet Adapter 0.15+
- **DEX Integration**: Jupiter API, Raydium SDK
- **Deployment**: Vercel (Frontend), Solana Mainnet/Devnet (Contracts)

---

## 📚 Documentation

### For Developers:
- Smart contract documentation (Rust docs)
- API documentation
- Component library (Storybook)
- Setup and deployment guide

### For Users:
- User guide for all features
- Video tutorials
- FAQ section
- Troubleshooting guide

---

## 🚀 Deployment Strategy

### Phase 4:
1. Deploy Anchor programs to Devnet
2. Test extensively on Devnet
3. Security audit
4. Deploy to Mainnet Beta
5. Monitor and iterate

### Phase 5:
1. Incremental feature rollout
2. Beta testing with select users
3. Gather feedback and optimize
4. Public release
5. Continuous monitoring

---

## 📝 Notes

- All dates are tentative and subject to change
- Security audits required before mainnet deployment
- Community feedback will influence feature priorities
- Mobile app may be considered after Phase 5

---

**Last Updated**: November 20, 2025
**Version**: 1.0.0
**Maintainers**: SolSoil Development Team
