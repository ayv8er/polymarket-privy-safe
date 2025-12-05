export const formatAddress = (
  address: string,
  startChars = 6,
  endChars = 4
) => `${address.slice(0, startChars)}...${address.slice(-endChars)}`;

export const formatPrice = (price: number) => `${Math.round(price * 100)}¢`;

export const formatCurrency = (value: number, decimals = 2) =>
  `$${value.toFixed(decimals)}`;

export const formatVolume = (volumeUSD: number) => {
  if (volumeUSD >= 1_000_000)
    return `$${(volumeUSD / 1_000_000).toFixed(2)}M`;
  if (volumeUSD >= 1_000) return `$${(volumeUSD / 1_000).toFixed(1)}K`;
  return `$${volumeUSD.toFixed(0)}`;
};

export const formatLiquidity = (liquidityUSD: number) => {
  if (liquidityUSD >= 1_000_000)
    return `$${(liquidityUSD / 1_000_000).toFixed(2)}M`;
  if (liquidityUSD >= 1_000) return `$${(liquidityUSD / 1_000).toFixed(0)}K`;
  return `$${liquidityUSD.toFixed(0)}`;
};

export const formatPercentage = (value: number, decimals = 1) =>
  `${value.toFixed(decimals)}%`;

export const formatShares = (shares: number, decimals = 2) =>
  shares.toFixed(decimals);

