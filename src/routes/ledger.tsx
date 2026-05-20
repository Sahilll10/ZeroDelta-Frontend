import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, Download } from "lucide-react";
import { mockOrders, formatCurrency, formatNumber, type Order } from "@/lib/mock";

export const Route = createFileRoute("/ledger")({
  head: () => ({
    meta: [
      { title: "Ledger — ZeroDelta" },
      { name: "description", content: "Complete history of orders and transactions." },
    ],
  }),
  component: LedgerPage,
});

const statusStyles: Record<Order["status"], string> = {
  PENDING: "bg-warning-muted text-warning-foreground border-warning/30",
  PROCESSING: "bg-info-muted text-primary border-primary/20",
  EXECUTED: "bg-success-muted text-success border-success/30",
  FAILED: "bg-danger-muted text-danger border-danger/30",
};

const PAGE_SIZE = 8;

function LedgerPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return mockOrders.filter((o) => {
      if (status !== "All" && o.status !== status) return false;
      if (type !== "All" && o.type !== type) return false;
      if (q && !`${o.ticker} ${o.asset} ${o.id}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, status, type]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppShell title="Transaction Ledger">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {(["EXECUTED", "PROCESSING", "PENDING", "FAILED"] as const).map((s) => {
            const count = mockOrders.filter((o) => o.status === s).length;
            return (
              <Card key={s}>
                <CardContent className="pt-6">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{s}</div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-semibold tabular-nums">{count}</span>
                    <Badge variant="outline" className={statusStyles[s]}>{s}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Every transaction across all asset classes</CardDescription>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search ticker, order ID"
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPage(1); }}
                  className="h-9 w-full pl-9 md:w-64"
                />
              </div>
              <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
                <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="BUY">Buy</SelectItem>
                  <SelectItem value="SELL">Sell</SelectItem>
                  <SelectItem value="SIP">SIP</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="EXECUTED">Executed</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-9">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Order ID</th>
                  <th className="px-3 py-3 font-medium">Type</th>
                  <th className="px-3 py-3 font-medium">Asset</th>
                  <th className="px-3 py-3 text-right font-medium">Units</th>
                  <th className="px-3 py-3 text-right font-medium">Amount</th>
                  <th className="px-3 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {current.map((o) => (
                  <tr key={o.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                    <td className="px-3 py-4 tabular-nums text-muted-foreground">{o.date}</td>
                    <td className="px-3 py-4 font-mono text-xs text-muted-foreground">{o.id}</td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                          o.type === "BUY"
                            ? "bg-success-muted text-success"
                            : o.type === "SELL"
                            ? "bg-danger-muted text-danger"
                            : "bg-info-muted text-primary"
                        }`}
                      >
                        {o.type}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="font-medium text-foreground">{o.asset}</div>
                      <div className="text-xs text-muted-foreground">{o.ticker}</div>
                    </td>
                    <td className="px-3 py-4 text-right tabular-nums">{formatNumber(o.units, 4)}</td>
                    <td className="px-3 py-4 text-right tabular-nums font-medium">{formatCurrency(o.amount)}</td>
                    <td className="px-3 py-4 text-right">
                      <Badge variant="outline" className={statusStyles[o.status]}>
                        {o.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {current.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-12 text-center text-sm text-muted-foreground">
                      No transactions match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
              <span>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <span className="tabular-nums">
                  Page {page} of {pageCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === pageCount}
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
