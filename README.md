# SolSoil - Solana Launchpad Platform

A comprehensive Solana launchpad platform featuring token creation, NFT management, token presales, DEX integration, NFT marketplace, and staking - all built with Next.js, React, Anchor, and Solana Web3.

---

## ✨ Features

### 🔗 Wallet & Network
- **Multi-Wallet Support**: Connect with Phantom, Solflare, and other Solana wallets
- **Network Switching**: Seamlessly switch between Mainnet, Devnet, and Testnet
- **Dark/Light Theme**: Toggle between themes for optimal viewing experience

### 💰 Wallet Operations
- **View Balance**: Real-time SOL balance display with auto-refresh
- **Send Tokens**: Transfer SOL to any Solana address
- **Request Airdrop**: Get testnet SOL for development (Devnet/Testnet only)
- **Sign Messages**: Cryptographically sign messages with your wallet

### 🚀 Token Launchpad (Phase 1-2)
- **Create SPL Tokens**: Launch custom tokens using Token-2022 standard
- **Token Metadata**: Configure name, symbol, decimals, and supply
- **Image Upload**: Integrated Cloudinary support for token logos
- **Metadata Extensions**: Automatic metadata pointer and ATA creation
- **Mint More**: Mint additional supply to existing tokens

### 🔄 Token Swap (Phase 3)
- **Jupiter Integration**: Best price routing across all Solana DEXs
- **Token Search**: Easily find and select tokens to swap
- **Slippage Control**: Configure slippage tolerance for optimal trades
- **Price Impact**: Real-time price impact warnings
- **Transaction History**: Track your swap history

### 🎨 NFT Studio (Phase 3)
- **NFT Minting**: Create individual NFTs with metadata
- **NFT Collections**: Create and manage verified collections
- **Bulk Minting**: Batch mint multiple NFTs with CSV upload
- **NFT Gallery**: View all your NFTs in a beautiful grid layout
- **Metadata Management**: Full control over NFT attributes and properties
- **Royalty Configuration**: Set creator royalties for secondary sales

### 💎 Token Presale & ICO (Phase 4)
- **Create Presales**: Launch token presales with customizable parameters
- **Contribution System**: Accept SOL contributions with min/max limits
- **Soft/Hard Caps**: Set funding goals with automatic refunds
- **Vesting Schedules**: Configure linear vesting with cliff periods
- **Whitelist Support**: Private sales with whitelist management
- **Token Claims**: Automatic token distribution after presale success
- **Presale Dashboard**: Monitor all active, upcoming, and ended presales
- **My Contributions**: Track your presale investments and claimable tokens

### 🏪 NFT Marketplace (Phase 5)
- **List NFTs**: List your NFTs for fixed-price sales
- **Buy NFTs**: Purchase NFTs instantly from listings
- **Marketplace Fees**: Configurable platform fees for sustainability
- **Royalty Enforcement**: Automatic creator royalty distribution

### 🔒 Token Staking (Phase 5)
- **Stake Tokens**: Lock tokens to earn rewards
- **Flexible APY**: Configurable reward rates and lock periods
- **Claim Rewards**: Withdraw earned rewards anytime
- **Unstake**: Withdraw staked tokens after lock period
- **Staking Dashboard**: Monitor total staked value and earnings

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: TailwindCSS 4, Radix UI
- **Animations**: Framer Motion
- **State Management**: Redux Toolkit
- **Package Manager**: Bun

### Blockchain
- **Framework**: Anchor 0.30.1
- **Language**: Rust
- **Network**: Solana (Web3.js)
- **Wallet**: Solana Wallet Adapter
- **Token Standard**: SPL Token, Token-2022
- **NFT Standard**: Metaplex Token Metadata

### Integrations
- **DEX**: Jupiter Aggregator
- **Storage**: Cloudinary (Images & Metadata)
- **RPC**: Configurable (Mainnet/Devnet/Testnet)

---

## 📁 Project Structure

```
Solana-Launchpad/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home (Token operations)
│   ├── swap/                     # Token swap page
│   ├── nfts/                     # NFT studio page
│   ├── launchpad/                # Presale pages
│   │   ├── page.tsx              # Presale dashboard
│   │   ├── create/               # Create presale
│   │   ├── [id]/                 # Presale details
│   │   └── my-contributions/     # User contributions
│   ├── marketplace/              # NFT marketplace (Phase 5)
│   └── staking/                  # Staking platform (Phase 5)
│
├── components/                   # React components
│   ├── ui/                       # Radix UI components
│   ├── swap/                     # Swap interface
│   ├── launchpad/                # Presale components
│   ├── marketplace/              # Marketplace components
│   └── staking/                  # Staking components
│
├── programs/                     # Anchor smart contracts
│   ├── launchpad/                # Presale/ICO program
│   │   └── src/
│   │       ├── lib.rs            # Program entry
│   │       ├── instructions/     # All instructions
│   │       ├── state/            # Account structures
│   │       └── errors.rs         # Custom errors
│   ├── marketplace/              # NFT marketplace program
│   └── staking/                  # Token staking program
│
├── lib/                          # Utility libraries
│   ├── anchor/                   # Anchor SDK integration
│   ├── jupiter.ts                # Jupiter API
│   └── tokenMetadata.ts          # Token utilities
│
├── hooks/                        # React hooks
│   ├── useLaunchpad.ts
│   ├── usePresale.ts
│   └── use-wallet-model.tsx
│
├── context/                      # React contexts
│   ├── RpcContext.tsx            # Network switching
│   └── ThemeContext.tsx          # Theme management
│
├── provider/                     # Global providers
├── store/                        # Redux store
├── tests/                        # Anchor tests
└── target/                       # Build artifacts

```

---

## 🚀 Installation

This project uses [Bun](https://bun.sh/) as the package manager and runtime.

### Prerequisites
- **Node.js** 18+ or **Bun** runtime
- **Rust** & **Cargo** (for Anchor programs)
- **Solana CLI** (optional, for deployment)
- **Anchor CLI** (optional, for building contracts)

### 1. Clone the repository
```sh
git clone https://github.com/your-username/Solana-Launchpad.git
cd Solana-Launchpad
```

### 2. Install frontend dependencies
```sh
bun install
# or
npm install
```

### 3. Install Anchor dependencies (for smart contracts)
```sh
cd programs/launchpad && cargo build-bpf
cd ../marketplace && cargo build-bpf
cd ../staking && cargo build-bpf
cd ../..
```

### 4. Configure environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_UPLOAD_PRESET=your_upload_preset
NEXT_PUBLIC_CLOUD_API_KEY=your_cloudinary_key
NEXT_PUBLIC_CLOUD_API_SECRET=your_cloudinary_secret
```

### 5. Start the development server
```sh
bun run dev
# or
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🔧 Building & Deploying Smart Contracts

### Build Anchor Programs
```sh
# Build all programs
anchor build

# Or build individually
cd programs/launchpad && cargo build-bpf
cd programs/marketplace && cargo build-bpf
cd programs/staking && cargo build-bpf
```

### Deploy to Devnet
```sh
# Configure Solana CLI for Devnet
solana config set --url devnet

# Deploy programs
anchor deploy --provider.cluster devnet

# Or deploy manually
solana program deploy target/deploy/launchpad.so
solana program deploy target/deploy/marketplace.so
solana program deploy target/deploy/staking.so
```

### Run Tests
```sh
# Run Anchor tests
anchor test

# Run specific test file
anchor test tests/launchpad.ts
```

---

## 📖 Usage Guide

### Creating a Token
1. Navigate to the home page
2. Scroll to the "Token Launchpad" section
3. Fill in token details (name, symbol, decimals, supply)
4. Upload a token image
5. Click "Create Token" and approve the transaction

### Swapping Tokens
1. Go to the "Swap" page
2. Select input and output tokens
3. Enter the amount to swap
4. Adjust slippage if needed
5. Click "Swap" and confirm the transaction

### Minting NFTs
1. Navigate to the "NFTs" page
2. Choose between single mint or collection creation
3. Upload image and enter metadata
4. Configure royalties
5. Click "Mint NFT" and sign the transaction

### Launching a Presale
1. Go to "Launchpad" → "Create Presale"
2. Configure presale parameters:
   - Set soft cap and hard cap
   - Define contribution limits
   - Set token price
   - Configure start/end times
   - Enable vesting (optional)
   - Add whitelist (optional)
3. Fund the presale vault with tokens
4. Launch and share with your community

### Contributing to Presales
1. Browse presales on the Launchpad dashboard
2. Click on a presale to view details
3. Enter contribution amount
4. Click "Contribute" and approve the transaction
5. Track your contribution in "My Contributions"

### Claiming Tokens
1. After presale ends successfully, go to "My Contributions"
2. Find the presale and click "Claim Tokens"
3. If vesting is enabled, you'll see available tokens
4. Click "Claim" to receive your tokens

---

## 📊 Smart Contract Addresses

### Devnet
- **Launchpad Program**: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`
- **Marketplace Program**: `MKTPLcXGvjxPNCK6G5FoRFx3Nzs9J8vZwq9X2YLBVhpN`
- **Staking Program**: `STAKEXvjxPNCK6G5FoRFx3Nzs9J8vZwq9X2YLBVhpN`

### Mainnet (Coming Soon)
Programs will be deployed to Mainnet after comprehensive security audits.

---

## 🔒 Security

### Smart Contract Security
- All programs built with Anchor framework for enhanced security
- PDA-based account management
- Comprehensive input validation
- Overflow checks enabled
- Access control modifiers

### Before Mainnet Deployment
- [ ] Complete security audit by reputable firm
- [ ] Bug bounty program
- [ ] Multi-signature authority for critical functions
- [ ] Emergency pause mechanisms tested
- [ ] Extensive testnet deployment period

### Frontend Security
- No private key storage
- Transaction simulation before signing
- Input sanitization
- Rate limiting on API routes
- Secure environment variable handling

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code:
- Follows TypeScript/Rust best practices
- Includes appropriate tests
- Updates documentation as needed
- Passes all existing tests

---

## 📝 Development Roadmap

### ✅ Phase 1-2: Foundation (Completed)
- Wallet integration & basic operations
- SPL token creation with Token-2022
- UI/UX foundation

### ✅ Phase 3: Swap & NFT Studio (Completed)
- Jupiter DEX integration
- NFT minting and collections
- NFT gallery and bulk operations

### ✅ Phase 4: Presale & Launchpad (Completed)
- Anchor presale program
- Contribution and claiming system
- Vesting and whitelist support
- Launchpad frontend

### ✅ Phase 5: Marketplace & Staking (Completed)
- NFT marketplace smart contracts
- Token staking program
- Frontend interfaces

### 🔜 Phase 6: Advanced Features (Planned)
- Auction system for NFTs
- DAO governance integration
- Liquidity pool creation (Raydium)
- Portfolio analytics dashboard
- Mobile responsive optimization
- Multi-signature wallet support

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Community

- **Documentation**: [See plan.md](plan.md) for detailed technical specifications
- **Issues**: Report bugs on [GitHub Issues](https://github.com/your-username/Solana-Launchpad/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/your-username/Solana-Launchpad/discussions)

---

## 🙏 Acknowledgments

- [Solana Foundation](https://solana.org/) for the blockchain infrastructure
- [Anchor Framework](https://www.anchor-lang.com/) for smart contract development
- [Jupiter Aggregator](https://jup.ag/) for DEX routing
- [Metaplex](https://www.metaplex.com/) for NFT standards
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Cloudinary](https://cloudinary.com/) for media hosting

---

## ⚡ Quick Links

- **Live Demo**: Coming Soon
- **Docs**: [plan.md](plan.md)
- **Twitter**: [@YourProject](https://twitter.com/yourproject)
- **Discord**: [Join our community](https://discord.gg/yourserver)

---

Built with ❤️ for the Solana ecosystem
