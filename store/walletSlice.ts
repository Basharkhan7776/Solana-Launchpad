import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  address: string | null;
  connected: boolean;
}

const initialState: WalletState = {
  address: null,
  connected: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletAddress: (state, action: PayloadAction<string | null>) => {
      state.address = action.payload;
      state.connected = !!action.payload;
    },
    disconnectWallet: (state) => {
      state.address = null;
      state.connected = false;
    },
  },
});

export const { setWalletAddress, disconnectWallet } = walletSlice.actions;
export default walletSlice.reducer;
