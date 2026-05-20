import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarClock, Repeat, Trash2, Loader2 } from "lucide-react";
import { mockMarket, mockSIPs, formatCurrency, type SIP } from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/sip-automations")({
  head: () => ({
    meta: [
      { title: "SIP & Automations — ZeroDelta" },
      { name: "description", content: "Automate your investments with systematic investment plans." },
    ],
  }),
  component: SIPPage,
});

function SIPPage() {
  const [sips, setSips] = useState<SIP[]>(mockSIPs);
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<SIP["frequency"]>("Weekly");
  const [ticker, setTicker] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function createSIP(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !ticker) return;
    setSubmitting(true);
    setTimeout(() => {
      const asset = mockMarket.find((m) => m.ticker === ticker);
      const next = new Date();
      next.setDate(next.getDate() + (frequency === "Daily" ? 1 : frequency === "Weekly" ? 7 : 30));
      const sip: SIP = {
        id: `sip_${Math.random().toString(36).slice(2, 7)}`,
        ticker,
        asset: asset?.name ?? ticker,
        amount: Number(amount),
        frequency,
        nextExecution: next.toISOString().slice(0, 10),
        active: true,
      };
      setSips((s) => [sip, ...s]);
      setAmount("");
      setTicker("");
      setSubmitting(false);
      toast.success("SIP mandate created", { description: `${formatCurrency(sip.amount)} into ${sip.ticker} · ${sip.frequency}` });
    }, 700);
  }

  function toggleSIP(id: string) {
    setSips((s) => s.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));
  }
  function deleteSIP(id: string) {
    setSips((s) => s.filter((x) => x.id !== id));
    toast("SIP mandate removed");
  }

  const activeCount = sips.filter((s) => s.active).length;
  const monthlyDeployment = sips
    .filter((s) => s.active)
    .reduce((a, s) => a + s.amount * (s.frequency === "Daily" ? 30 : s.frequency === "Weekly" ? 4 : 1), 0);

  return (
    <AppShell title="SIP & Automations">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Active Mandates</div>
              <div className="mt-2 text-2xl font-semibold tabular-nums">{activeCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Est. Monthly Deployment</div>
              <div className="mt-2 text-2xl font-semibold tabular-nums">{formatCurrency(monthlyDeployment)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Next Execution</div>
              <div className="mt-2 text-2xl font-semibold">
                {sips.filter((s) => s.active).sort((a, b) => a.nextExecution.localeCompare(b.nextExecution))[0]?.nextExecution ?? "—"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Repeat className="h-5 w-5" />
                New SIP Mandate
              </CardTitle>
              <CardDescription>Automate periodic investments into any supported asset.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createSIP} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="sip-amount">Amount (USD)</Label>
                  <Input
                    id="sip-amount"
                    type="number"
                    inputMode="decimal"
                    placeholder="500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={frequency} onValueChange={(v) => setFrequency(v as SIP["frequency"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Asset</Label>
                  <Select value={ticker} onValueChange={setTicker}>
                    <SelectTrigger><SelectValue placeholder="Select asset" /></SelectTrigger>
                    <SelectContent>
                      {mockMarket.map((m) => (
                        <SelectItem key={m.ticker} value={m.ticker}>
                          {m.ticker} — {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  disabled={submitting || !amount || !ticker}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Mandate
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Active SIPs</CardTitle>
              <CardDescription>Your scheduled investment plans</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sips.length === 0 && (
                <div className="rounded-md border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
                  No active SIPs yet. Create your first mandate to start auto-investing.
                </div>
              )}
              {sips.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col gap-4 rounded-lg border border-border bg-card px-4 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                      <CalendarClock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {formatCurrency(s.amount)} → {s.ticker}
                      </div>
                      <div className="text-xs text-muted-foreground">{s.asset}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <Badge variant="secondary">{s.frequency}</Badge>
                    <div className="text-muted-foreground">
                      Next: <span className="text-foreground tabular-nums">{s.nextExecution}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={s.active} onCheckedChange={() => toggleSIP(s.id)} />
                      <span className="text-xs text-muted-foreground">{s.active ? "Active" : "Paused"}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteSIP(s.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
