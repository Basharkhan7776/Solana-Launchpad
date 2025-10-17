import { Connection, PublicKey } from "@solana/web3.js";
import { unpack } from "@solana/spl-token-metadata";

export interface TokenMetadata {
  name: string;
  symbol: string;
  uri: string;
  image?: string;
}

// Cache for token metadata
const metadataCache = new Map<string, TokenMetadata>();

export async function getTokenMetadata(
  connection: Connection,
  mintAddress: string
): Promise<TokenMetadata | null> {
  // Check cache first
  if (metadataCache.has(mintAddress)) {
    return metadataCache.get(mintAddress)!;
  }

  try {
    const mintPubkey = new PublicKey(mintAddress);
    const accountInfo = await connection.getAccountInfo(mintPubkey);

    if (!accountInfo?.data) {
      return null;
    }

    // Try to unpack metadata using SPL Token Metadata
    try {
      const metadata = unpack(accountInfo.data);

      const tokenMetadata: TokenMetadata = {
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
      };

      // If URI is provided, try to fetch the image
      if (metadata.uri) {
        try {
          const response = await fetch(metadata.uri);
          if (response.ok) {
            const jsonMetadata = await response.json();
            if (jsonMetadata.image) {
              tokenMetadata.image = jsonMetadata.image;
            }
          }
        } catch (error) {
          console.warn("Failed to fetch metadata from URI:", error);
        }
      }

      // Cache the metadata
      metadataCache.set(mintAddress, tokenMetadata);

      return tokenMetadata;
    } catch (error) {
      console.warn("Failed to unpack metadata for", mintAddress, error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    return null;
  }
}

export function clearMetadataCache() {
  metadataCache.clear();
}
