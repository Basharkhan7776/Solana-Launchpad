# SolSoil

A modern Solana wallet and launchpad dApp built with Next.js, React, and Solana Wallet Adapter.

---

##  Features
- Connect to Solana Mainnet, Devnet, or Testnet
- View wallet balance
- Request airdrop (on Devnet/Testnet)
- Send tokens
- Sign messages
- Beautiful, responsive UI

---

##  Installation

This project uses [Bun](https://bun.sh/) as the package manager and runtime.

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd Solana-Launchpad
```

### 2. Install dependencies
```sh
bun install
```

### 3. Start the development server
```sh
bun run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000) by default.

---

##  Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_UPLOAD_PRESET=your_upload_preset
NEXT_PUBLIC_CLOUD_API_KEY=your_cloud_api_key
NEXT_PUBLIC_CLOUD_API_SECRET=your_cloud_api_secret
```

- `NEXT_PUBLIC_CLOUD_NAME`: Your Cloudinary cloud name
- `NEXT_PUBLIC_UPLOAD_PRESET`: Your Cloudinary upload preset
- `NEXT_PUBLIC_CLOUD_API_KEY`: Your Cloudinary API key
- `NEXT_PUBLIC_CLOUD_API_SECRET`: Your Cloudinary API secret

**Note:** In Next.js, environment variables that need to be exposed to the browser must be prefixed with `NEXT_PUBLIC_`.


---

##  Screenshots

![Solana Launchpad Screenshot](public/screenshot.png)


---

##  License

MIT LICENSE
