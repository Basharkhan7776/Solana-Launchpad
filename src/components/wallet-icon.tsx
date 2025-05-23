
interface WalletIconProps {
  wallet: {
    icon: string;
    name: string;
  };
}

export function WalletIcon({ wallet }: WalletIconProps) {
  return (
    <img
      src={wallet.icon || "/placeholder.svg"}
      alt={`${wallet.name} icon`}
      width={24}
      height={24}
    />
  )
}

