import { NextRequest, NextResponse } from 'next/server';
import { PinataSDK } from 'pinata-web3';

// Initialize Pinata client
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metadata } = body;

    if (!metadata) {
      return NextResponse.json(
        { error: 'No metadata provided' },
        { status: 400 }
      );
    }

    // Upload metadata to IPFS via Pinata
    const result = await pinata.upload.json(metadata);

    // Construct the IPFS URL
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud';
    const metadataUri = `https://${gateway}/ipfs/${result.IpfsHash}`;

    return NextResponse.json({
      uri: metadataUri,
      ipfsHash: result.IpfsHash,
    });
  } catch (error) {
    console.error('Error uploading metadata:', error);
    return NextResponse.json(
      { error: 'Failed to upload metadata' },
      { status: 500 }
    );
  }
}
