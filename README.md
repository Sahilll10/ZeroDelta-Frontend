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

🚀 Quick Start (Local Development)1. Clone the repository:Bashgit clone [https://github.com/Sahilll10/ZeroDelta-backend.git](https://github.com/Sahilll10/ZeroDelta-backend.git)
cd ZeroDelta-backend
2. Configure your environment:Update src/main/resources/application.properties with your Neon database credentials:Propertiesspring.datasource.url=jdbc:postgresql://<your-neon-host>/neondb?sslmode=require
spring.datasource.username=<your_username>
spring.datasource.password=<your_password>
3. Build and Run:Bashmvn clean install
mvn spring-boot:run
The server will start on http://localhost:8000.📡 Key API EndpointsMethodEndpointDescriptionGET/api/v1/healthDeployment verification and health check.GET/api/v1/marketsReturns real-time market data (Crypto) sourced from DB.
