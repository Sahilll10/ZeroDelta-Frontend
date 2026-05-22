# ZeroDelta - Trading Dashboard 🚀

ZeroDelta is a high-performance financial dashboard built for real-time crypto portfolio tracking. It features live market data integration, dynamic currency conversion (INR), portfolio allocation visualizations, and automated drift alerts.

🔗 **Live Application:** [ZeroDelta on Vercel](https://zero-delta-frontend.vercel.app)  
🔗 **Backend Engine Repository:** [ZeroDelta-backend](https://github.com/Sahilll10/ZeroDelta-backend)  

## 🏗️ Application Workflow

```mermaid
graph TD;
    A[User visits Dashboard] -->|TanStack Router| B(DashboardPage Component);
    B -->|TanStack Query| C[ZeroDelta Backend API];
    C -->|Returns Live USD Prices| D{Frontend Processing};
    D -->|Applies USD_TO_INR Multiplier| E[State Update];
    E -->|Renders| F[Wallet Balance];
    E -->|Renders| G[Donut Chart Allocation];
    E -->|Renders| H[Active Holdings Table];

