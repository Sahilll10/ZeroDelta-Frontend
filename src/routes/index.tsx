import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZeroDelta — Multi-Asset Robo-Advisor" },
      { name: "description", content: "Trade crypto, stocks, bonds and mutual funds from one spacious, professional dashboard." },
      { property: "og:title", content: "ZeroDelta — Multi-Asset Robo-Advisor" },
      { property: "og:description", content: "All your markets, one calm interface." },
    ],
  }),
  component: () => <Navigate to="/dashboard" />,
});
