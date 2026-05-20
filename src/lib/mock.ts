// Mock data shaped to expected API contracts.
// GET /api/v1/portfolio
// POST /api/v1/orders
// GET /api/v1/market/prices

export type AssetClass = "Crypto" | "Stocks" | "Bonds" | "Mutual Funds";

export type Holding = {
  assetId: string;
  ticker: string;
  name: string;
  assetClass: AssetClass;
  units: number;
  avgPrice: number;
};

export type Portfolio = {
  fiatBalance: number;
  currency: "USD" | "INR";
  holdings: Holding[];
};

export type MarketAsset = {
  assetId: string;
  ticker: string;
  name: string;
  assetClass: AssetClass;
  price: number;
  change24h: number; // percentage
};

export type Order = {
  id: string;
  date: string;
  type: "BUY" | "SELL" | "SIP";
  ticker: string;
  asset: string;
  amount: number;
  units: number;
  status: "PENDING" | "PROCESSING" | "EXECUTED" | "FAILED";
};

export type SIP = {
  id: string;
  ticker: string;
  asset: string;
  amount: number;
  frequency: "Daily" | "Weekly" | "Monthly";
  nextExecution: string;
  active: boolean;
};

export type Allocation = {
  assetClass: AssetClass;
  actual: number; // percent
  target: number; // percent
};

export const mockPortfolio: Portfolio = {
  fiatBalance: 24850.42,
  currency: "USD",
  holdings: [
    { assetId: "btc", ticker: "BTC", name: "Bitcoin", assetClass: "Crypto", units: 0.42, avgPrice: 58200 },
    { assetId: "eth", ticker: "ETH", name: "Ethereum", assetClass: "Crypto", units: 3.1, avgPrice: 2980 },
    { assetId: "aapl", ticker: "AAPL", name: "Apple Inc.", assetClass: "Stocks", units: 22, avgPrice: 178.4 },
    { assetId: "msft", ticker: "MSFT", name: "Microsoft", assetClass: "Stocks", units: 14, avgPrice: 412.1 },
    { assetId: "tlt", ticker: "TLT", name: "US 20Y Treasury", assetClass: "Bonds", units: 60, avgPrice: 94.2 },
    { assetId: "vbtlx", ticker: "VBTLX", name: "Vanguard Total Bond", assetClass: "Mutual Funds", units: 120, avgPrice: 9.8 },
  ],
};

export const mockMarket: MarketAsset[] = [
  { assetId: "btc", ticker: "BTC", name: "Bitcoin", assetClass: "Crypto", price: 64120.55, change24h: 2.41 },
  { assetId: "eth", ticker: "ETH", name: "Ethereum", assetClass: "Crypto", price: 3284.12, change24h: -1.18 },
  { assetId: "sol", ticker: "SOL", name: "Solana", assetClass: "Crypto", price: 148.7, change24h: 4.62 },
  { assetId: "aapl", ticker: "AAPL", name: "Apple Inc.", assetClass: "Stocks", price: 192.34, change24h: 0.84 },
  { assetId: "msft", ticker: "MSFT", name: "Microsoft", assetClass: "Stocks", price: 428.9, change24h: -0.32 },
  { assetId: "nvda", ticker: "NVDA", name: "NVIDIA", assetClass: "Stocks", price: 124.2, change24h: 3.05 },
  { assetId: "tlt", ticker: "TLT", name: "US 20Y Treasury", assetClass: "Bonds", price: 91.55, change24h: -0.21 },
  { assetId: "ief", ticker: "IEF", name: "US 7-10Y Treasury", assetClass: "Bonds", price: 95.18, change24h: 0.14 },
  { assetId: "vbtlx", ticker: "VBTLX", name: "Vanguard Total Bond", assetClass: "Mutual Funds", price: 9.94, change24h: 0.08 },
  { assetId: "vfiax", ticker: "VFIAX", name: "Vanguard 500 Index", assetClass: "Mutual Funds", price: 482.6, change24h: 0.55 },
];

export const mockAllocations: Allocation[] = [
  { assetClass: "Crypto", actual: 38, target: 30 },
  { assetClass: "Stocks", actual: 34, target: 40 },
  { assetClass: "Bonds", actual: 14, target: 20 },
  { assetClass: "Mutual Funds", actual: 14, target: 10 },
];

export const mockOrders: Order[] = [
  { id: "ord_1041", date: "2026-05-19 14:22", type: "BUY", ticker: "BTC", asset: "Bitcoin", amount: 2500, units: 0.039, status: "EXECUTED" },
  { id: "ord_1040", date: "2026-05-19 09:10", type: "SIP", ticker: "VFIAX", asset: "Vanguard 500 Index", amount: 500, units: 1.03, status: "EXECUTED" },
  { id: "ord_1039", date: "2026-05-18 18:55", type: "SELL", ticker: "ETH", asset: "Ethereum", amount: 1200, units: 0.366, status: "PROCESSING" },
  { id: "ord_1038", date: "2026-05-18 11:02", type: "BUY", ticker: "AAPL", asset: "Apple Inc.", amount: 800, units: 4.16, status: "EXECUTED" },
  { id: "ord_1037", date: "2026-05-17 16:30", type: "BUY", ticker: "SOL", asset: "Solana", amount: 300, units: 2.02, status: "FAILED" },
  { id: "ord_1036", date: "2026-05-17 10:14", type: "SIP", ticker: "VBTLX", asset: "Vanguard Total Bond", amount: 250, units: 25.15, status: "EXECUTED" },
  { id: "ord_1035", date: "2026-05-16 09:00", type: "BUY", ticker: "TLT", asset: "US 20Y Treasury", amount: 1000, units: 10.92, status: "PENDING" },
  { id: "ord_1034", date: "2026-05-15 13:42", type: "SELL", ticker: "MSFT", asset: "Microsoft", amount: 1700, units: 3.96, status: "EXECUTED" },
  { id: "ord_1033", date: "2026-05-15 08:21", type: "BUY", ticker: "NVDA", asset: "NVIDIA", amount: 1200, units: 9.66, status: "EXECUTED" },
  { id: "ord_1032", date: "2026-05-14 17:55", type: "SIP", ticker: "BTC", asset: "Bitcoin", amount: 100, units: 0.0016, status: "EXECUTED" },
  { id: "ord_1031", date: "2026-05-14 11:08", type: "BUY", ticker: "ETH", asset: "Ethereum", amount: 600, units: 0.183, status: "EXECUTED" },
  { id: "ord_1030", date: "2026-05-13 09:33", type: "SELL", ticker: "IEF", asset: "US 7-10Y Treasury", amount: 400, units: 4.20, status: "EXECUTED" },
];

export const mockSIPs: SIP[] = [
  { id: "sip_01", ticker: "VFIAX", asset: "Vanguard 500 Index", amount: 500, frequency: "Weekly", nextExecution: "2026-05-26", active: true },
  { id: "sip_02", ticker: "BTC", asset: "Bitcoin", amount: 100, frequency: "Daily", nextExecution: "2026-05-21", active: true },
  { id: "sip_03", ticker: "VBTLX", asset: "Vanguard Total Bond", amount: 250, frequency: "Monthly", nextExecution: "2026-06-01", active: true },
  { id: "sip_04", ticker: "ETH", asset: "Ethereum", amount: 150, frequency: "Weekly", nextExecution: "2026-05-24", active: false },
];

export function formatCurrency(n: number, currency: "USD" | "INR" = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatNumber(n: number, digits = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}
