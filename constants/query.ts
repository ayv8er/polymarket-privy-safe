export const QUERY_STALE_TIMES = {
  BALANCE: 2_000,
  POSITIONS: 5_000,
  MARKETS: 300_000,
  ORDERS: 5_000,
} as const;

export const QUERY_REFETCH_INTERVALS = {
  BALANCE: 3_000,
  POSITIONS: 5_000,
  ORDERS: 3_000,
} as const;

export const POLLING_DURATION = 30_000; // 30 seconds
export const POLLING_INTERVAL = 2_000; // 2 seconds

