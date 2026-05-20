import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowDownToLine, ArrowUpFromLine, TrendingUp, TrendingDown, AlertTriangle, Wallet } from "lucide-react";
import { mockPortfolio, mockMarket, mockAllocations, formatCurrency, formatNumber } from "@/lib/mock";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ZeroDelta" },
      { name: "description", content: "Your portfolio at a glance: wallet balance, allocation, and rebalancing alerts." },
    ],
  }),
  component: DashboardPage,
});

const allocationColor: Record<string, string> = {
  Crypto: "oklch(0.55 0.18 255)",
  Stocks: "oklch(0.62 0.18 145)",
  Bonds: "oklch(0.7 0.14 75)",
  "Mutual Funds": "oklch(0.55 0.18 300)",
};

function DonutChart({ data }: { data: { assetClass: string; actual: number }[] }) {
  const size = 220;
  const stroke = 28;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.94 0.005 250)"
          strokeWidth={stroke}
        />
        {data.map((d) => {
          const len = (d.actual / 100) * circumference;
          const seg = (
            <circle
              key={d.assetClass}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={allocationColor[d.assetClass] ?? "#999"}
              strokeWidth={stroke}
              strokeDasharray={`${len} ${circumference - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return seg;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Total Portfolio</span>
        <span className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
          {formatCurrency(82430)}
        </span>
      </div>
    </div>
  );
}

function DashboardPage() {
  const portfolio = mockPortfolio;
  const market = Object.fromEntries(mockMarket.map((m) => [m.ticker, m]));

  const positions = portfolio.holdings.map((h) => {
    const live = market[h.ticker];
    const price = live?.price ?? h.avgPrice;
    const value = price * h.units;
    const pnl = (price - h.avgPrice) * h.units;
    const pnlPct = ((price - h.avgPrice) / h.avgPrice) * 100;
    return { ...h, price, value, pnl, pnlPct, change24h: live?.change24h ?? 0 };
  });

  const portfolioValue = positions.reduce((a, p) => a + p.value, 0);
  const totalPnl = positions.reduce((a, p) => a + p.pnl, 0);
  const totalPnlPct = (totalPnl / (portfolioValue - totalPnl)) * 100;

  const maxDrift = Math.max(...mockAllocations.map((a) => Math.abs(a.actual - a.target)));
  const showDrift = maxDrift > 5;

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        {showDrift && (
          <Alert className="border-warning/40 bg-warning-muted/60">
            <AlertTriangle className="h-4 w-4 text-warning-foreground" />
            <div className="flex w-full flex-col items-start justify-between gap-3 md:flex-row md:items-center">
              <div>
                <AlertTitle className="text-warning-foreground">Portfolio drift detected</AlertTitle>
                <AlertDescription className="text-warning-foreground/80">
                  Your allocation has drifted {maxDrift}% from target. Rebalance to stay on plan.
                </AlertDescription>
              </div>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Execute Rebalance
              </Button>
            </div>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardDescription>Fiat Wallet</CardDescription>
                <CardTitle className="mt-1 text-3xl font-semibold tabular-nums">
                  {formatCurrency(portfolio.fiatBalance, portfolio.currency)}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Available for trading and withdrawals</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <Wallet className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-success text-success-foreground hover:bg-success/90">
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Deposit
                </Button>
                <Button variant="outline">
                  <ArrowUpFromLine className="mr-2 h-4 w-4" />
                  Withdraw
                </Button>
                <div className="ml-auto flex items-center gap-6 text-sm">
                  <div>
                    <div className="text-muted-foreground">Invested</div>
                    <div className="font-semibold tabular-nums">{formatCurrency(portfolioValue)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">All-time P/L</div>
                    <div
                      className={`font-semibold tabular-nums ${totalPnl >= 0 ? "text-success" : "text-danger"}`}
                    >
                      {totalPnl >= 0 ? "+" : ""}
                      {formatCurrency(totalPnl)} ({totalPnlPct.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Today</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums text-success">
                +{formatCurrency(1248.32)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">+1.54% across portfolio in last 24h</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {positions.slice(0, 3).map((p) => (
                <div key={p.assetId} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{p.ticker}</span>
                  <span
                    className={`tabular-nums ${p.change24h >= 0 ? "text-success" : "text-danger"}`}
                  >
                    {p.change24h >= 0 ? "+" : ""}
                    {p.change24h.toFixed(2)}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
              <CardDescription>Actual distribution across asset classes</CardDescription>
            </CardHeader>
            <CardContent>
              <DonutChart data={mockAllocations} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Actual vs Target</CardTitle>
              <CardDescription>How close you are to your investment plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {mockAllocations.map((a) => {
                const drift = a.actual - a.target;
                return (
                  <div key={a.assetClass} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-sm"
                          style={{ backgroundColor: allocationColor[a.assetClass] }}
                        />
                        <span className="font-medium text-foreground">{a.assetClass}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Target {a.target}%</span>
                        <span className="font-semibold text-foreground tabular-nums">{a.actual}%</span>
                        <Badge
                          variant="secondary"
                          className={
                            Math.abs(drift) > 5
                              ? "bg-warning-muted text-warning-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }
                        >
                          {drift > 0 ? "+" : ""}
                          {drift}%
                        </Badge>
                      </div>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="absolute top-0 left-0 h-full"
                        style={{
                          width: `${a.actual}%`,
                          backgroundColor: allocationColor[a.assetClass],
                        }}
                      />
                      <div
                        className="absolute top-0 h-full w-0.5 bg-foreground/70"
                        style={{ left: `${a.target}%` }}
                        aria-label="target marker"
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
            <CardDescription>Live valuation of your active positions</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-3 font-medium">Asset</th>
                  <th className="px-3 py-3 font-medium">Class</th>
                  <th className="px-3 py-3 text-right font-medium">Units</th>
                  <th className="px-3 py-3 text-right font-medium">Avg Price</th>
                  <th className="px-3 py-3 text-right font-medium">Market Price</th>
                  <th className="px-3 py-3 text-right font-medium">Value</th>
                  <th className="px-3 py-3 text-right font-medium">P/L</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((p) => (
                  <tr key={p.assetId} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-4">
                      <div className="font-medium text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.ticker}</div>
                    </td>
                    <td className="px-3 py-4 text-muted-foreground">{p.assetClass}</td>
                    <td className="px-3 py-4 text-right tabular-nums">{formatNumber(p.units, 4)}</td>
                    <td className="px-3 py-4 text-right tabular-nums">{formatCurrency(p.avgPrice)}</td>
                    <td className="px-3 py-4 text-right tabular-nums">{formatCurrency(p.price)}</td>
                    <td className="px-3 py-4 text-right tabular-nums font-medium">{formatCurrency(p.value)}</td>
                    <td className={`px-3 py-4 text-right tabular-nums font-medium ${p.pnl >= 0 ? "text-success" : "text-danger"}`}>
                      <div className="inline-flex items-center justify-end gap-1">
                        {p.pnl >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {p.pnl >= 0 ? "+" : ""}
                        {formatCurrency(p.pnl)} ({p.pnlPct.toFixed(2)}%)
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
