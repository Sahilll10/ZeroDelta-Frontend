import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, Loader2, Search } from "lucide-react";
import { mockMarket, formatCurrency, formatNumber, type MarketAsset } from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: "Markets — ZeroDelta" },
      { name: "description", content: "Live trading terminal across crypto, stocks, bonds and mutual funds." },
    ],
  }),
  component: MarketsPage,
});

type OrderSide = "BUY" | "SELL";
type OrderType = "MARKET" | "LIMIT";

function OrderPanel({
  asset,
  side,
  open,
  onOpenChange,
}: {
  asset: MarketAsset | null;
  side: OrderSide;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [orderType, setOrderType] = useState<OrderType>("MARKET");
  const [amount, setAmount] = useState<string>("");
  const [limit, setLimit] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const price = asset?.price ?? 0;
  const effective = orderType === "LIMIT" && Number(limit) > 0 ? Number(limit) : price;
  const units = Number(amount) > 0 && effective > 0 ? Number(amount) / effective : 0;

  function submit() {
    if (!asset || !Number(amount)) return;
    setSubmitting(true);
    // Optimistic — POST /api/v1/orders
    setTimeout(() => {
      setSubmitting(false);
      toast.success(`${side} order placed`, {
        description: `${formatNumber(units, 4)} ${asset.ticker} @ ${formatCurrency(effective)}`,
      });
      setAmount("");
      onOpenChange(false);
    }, 900);
  }

  const isBuy = side === "BUY";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="flex items-center justify-between">
            <span>{isBuy ? "Buy" : "Sell"} {asset?.ticker}</span>
            <Badge variant="secondary" className="font-normal">{asset?.assetClass}</Badge>
          </SheetTitle>
          <SheetDescription>{asset?.name}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 px-6 py-6">
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Market Price</div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-semibold tabular-nums">{formatCurrency(price)}</span>
              <span className={`text-sm tabular-nums ${(asset?.change24h ?? 0) >= 0 ? "text-success" : "text-danger"}`}>
                {(asset?.change24h ?? 0) >= 0 ? "+" : ""}
                {asset?.change24h?.toFixed(2)}% 24h
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Order Type</Label>
            <Select value={orderType} onValueChange={(v) => setOrderType(v as OrderType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MARKET">Market</SelectItem>
                <SelectItem value="LIMIT">Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {orderType === "LIMIT" && (
            <div className="space-y-2">
              <Label htmlFor="limit">Limit Price (USD)</Label>
              <Input
                id="limit"
                type="number"
                inputMode="decimal"
                placeholder={String(price)}
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex gap-2 pt-1">
              {[100, 500, 1000, 5000].map((v) => (
                <Button
                  key={v}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(String(v))}
                  className="h-7 text-xs"
                >
                  ${v.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border px-4 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estimated Units</span>
              <span className="font-medium tabular-nums">{formatNumber(units, 6)} {asset?.ticker}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">Estimated Fee</span>
              <span className="tabular-nums">{formatCurrency(Number(amount) * 0.0015 || 0)}</span>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t border-border px-6 py-4">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button
            onClick={submit}
            disabled={submitting || !Number(amount)}
            className={
              isBuy
                ? "bg-success text-success-foreground hover:bg-success/90"
                : "bg-danger text-danger-foreground hover:bg-danger/90"
            }
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isBuy ? "Confirm Buy" : "Confirm Sell"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function MarketsPage() {
  const [filter, setFilter] = useState<string>("All");
  const [q, setQ] = useState("");
  const [side, setSide] = useState<OrderSide>("BUY");
  const [selected, setSelected] = useState<MarketAsset | null>(null);
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => {
    return mockMarket.filter((m) => {
      if (filter !== "All" && m.assetClass !== filter) return false;
      if (q && !`${m.ticker} ${m.name}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [filter, q]);

  function openOrder(asset: MarketAsset, s: OrderSide) {
    setSelected(asset);
    setSide(s);
    setOpen(true);
  }

  return (
    <AppShell title="Markets">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Top Gainer (24h)", value: "SOL", change: 4.62, pos: true },
            { label: "Top Loser (24h)", value: "ETH", change: -1.18, pos: false },
            { label: "Most Active", value: "BTC", change: 2.41, pos: true },
            { label: "Listed Assets", value: String(mockMarket.length), change: 0, pos: true },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xl font-semibold">{s.value}</span>
                  {s.change !== 0 && (
                    <span className={`text-sm tabular-nums ${s.pos ? "text-success" : "text-danger"}`}>
                      {s.pos ? "+" : ""}
                      {s.change}%
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Live Markets</CardTitle>
              <CardDescription>Real-time prices streamed via WebSocket</CardDescription>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search asset"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="h-9 w-full pl-9 md:w-64"
                />
              </div>
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList>
                  <TabsTrigger value="All">All</TabsTrigger>
                  <TabsTrigger value="Crypto">Crypto</TabsTrigger>
                  <TabsTrigger value="Stocks">Stocks</TabsTrigger>
                  <TabsTrigger value="Bonds">Bonds</TabsTrigger>
                  <TabsTrigger value="Mutual Funds">Funds</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-3 font-medium">Asset</th>
                  <th className="px-3 py-3 font-medium">Ticker</th>
                  <th className="px-3 py-3 font-medium">Class</th>
                  <th className="px-3 py-3 text-right font-medium">Price</th>
                  <th className="px-3 py-3 text-right font-medium">24h Change</th>
                  <th className="px-3 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.assetId} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                    <td className="px-3 py-4 font-medium text-foreground">{m.name}</td>
                    <td className="px-3 py-4 text-muted-foreground">{m.ticker}</td>
                    <td className="px-3 py-4">
                      <Badge variant="secondary" className="font-normal">{m.assetClass}</Badge>
                    </td>
                    <td className="px-3 py-4 text-right tabular-nums">{formatCurrency(m.price)}</td>
                    <td className={`px-3 py-4 text-right tabular-nums font-medium ${m.change24h >= 0 ? "text-success" : "text-danger"}`}>
                      <span className="inline-flex items-center justify-end gap-1">
                        {m.change24h >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        {m.change24h >= 0 ? "+" : ""}
                        {m.change24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-success text-success-foreground hover:bg-success/90"
                          onClick={() => openOrder(m, "BUY")}
                        >
                          Buy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-danger/40 text-danger hover:bg-danger-muted hover:text-danger"
                          onClick={() => openOrder(m, "SELL")}
                        >
                          Sell
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <OrderPanel asset={selected} side={side} open={open} onOpenChange={setOpen} />
    </AppShell>
  );
}
