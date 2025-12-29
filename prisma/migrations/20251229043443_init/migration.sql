-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "InvestorStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "HistoryStatus" AS ENUM ('PENDING', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "WalletAsset" AS ENUM ('USDT', 'USDC');

-- CreateEnum
CREATE TYPE "WalletNetwork" AS ENUM ('TRC20', 'BEP20', 'ERC20', 'POLYGON');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('DEPOSIT', 'WITHDRAWAL');

-- CreateEnum
CREATE TYPE "RequestMethod" AS ENUM ('USDT', 'USDC', 'LEMON_CASH', 'CASH', 'SWIFT');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investor" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "InvestorStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "currentBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalInvested" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "accumulatedReturnUSD" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "accumulatedReturnPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "annualReturnUSD" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "annualReturnPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioHistory" (
    "id" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "previousBalance" DOUBLE PRECISION NOT NULL,
    "newBalance" DOUBLE PRECISION NOT NULL,
    "status" "HistoryStatus" NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "asset" "WalletAsset" NOT NULL,
    "network" "WalletNetwork" NOT NULL,
    "address" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "type" "RequestType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "RequestMethod" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "lemontag" TEXT,
    "transactionHash" TEXT,
    "network" "WalletNetwork",
    "notes" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Investor_email_key" ON "Investor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Investor_code_key" ON "Investor"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_investorId_key" ON "Portfolio"("investorId");

-- CreateIndex
CREATE INDEX "PortfolioHistory_investorId_date_idx" ON "PortfolioHistory"("investorId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_asset_network_key" ON "Wallet"("asset", "network");

-- CreateIndex
CREATE INDEX "Request_investorId_status_idx" ON "Request"("investorId", "status");

-- CreateIndex
CREATE INDEX "Request_status_requestedAt_idx" ON "Request"("status", "requestedAt");

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioHistory" ADD CONSTRAINT "PortfolioHistory_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
