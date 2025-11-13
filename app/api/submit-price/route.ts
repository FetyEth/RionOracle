import { type NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

const simpleAggregatorABI = [
  "function submitValue(int256 value, uint256 timestamp) external",
  "function latestRoundData() external view returns (uint256 roundId, int256 answer, uint256 timestamp, uint256 observationCount)",
  "function authorizedOracles(address) external view returns (bool)",
];

export async function POST(req: NextRequest) {
  try {
    const { symbol, price, oracleName } = await req.json();

    // Get the contract address for the symbol
    const contractAddresses: Record<string, string> = {
      BNB: process.env.NEXT_PUBLIC_BNB_AGGREGATOR_ADDRESS || "",
      ETH: process.env.NEXT_PUBLIC_ETH_AGGREGATOR_ADDRESS || "",
      BTC: process.env.NEXT_PUBLIC_BTC_AGGREGATOR_ADDRESS || "",
      SOL: process.env.NEXT_PUBLIC_SOL_AGGREGATOR_ADDRESS || "",
      XRP: process.env.NEXT_PUBLIC_XRP_AGGREGATOR_ADDRESS || "",
      DOGE: process.env.NEXT_PUBLIC_DOGE_AGGREGATOR_ADDRESS || "",
      LINK: process.env.NEXT_PUBLIC_LINK_AGGREGATOR_ADDRESS || "",
    };

    const contractAddress = contractAddresses[symbol];
    if (!contractAddress) {
      return NextResponse.json({ error: "Invalid symbol" }, { status: 400 });
    }

    // Get the private key for the oracle
    const oracleKeys: Record<string, string> = {
      "Council-01": process.env.COUNCIL_01_PRIVATE_KEY || "",
      "Council-02": process.env.COUNCIL_02_PRIVATE_KEY || "",
      "Council-03": process.env.COUNCIL_03_PRIVATE_KEY || "",
    };

    const privateKey = oracleKeys[oracleName];
    if (!privateKey) {
      return NextResponse.json(
        { error: "Invalid oracle name" },
        { status: 400 }
      );
    }

    // Setup provider and wallet
    const rpcUrl =
      process.env.NEXT_PUBLIC_RPC_URL ||
      "https://data-seed-prebsc-1-s1.binance.org:8545";
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Create contract instance
    const contract = new ethers.Contract(
      contractAddress,
      simpleAggregatorABI,
      wallet
    );

    // Convert price to 8 decimals
    const value = Math.floor(price * 1e8);
    const timestamp = Math.floor(Date.now() / 1000) - 60;

    console.log(
      `[API] ${oracleName} submitting ${symbol}: $${price.toFixed(2)}`
    );

    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice
      ? (feeData.gasPrice * BigInt(120)) / BigInt(100)
      : undefined;

    // Submit the transaction with increased gas price
    const tx = await contract.submitValue(value, timestamp, {
      gasPrice,
      gasLimit: 200000,
    });
    const receipt = await tx.wait();

    console.log(
      `[API] ${oracleName} ✅ ${symbol} submitted - Tx: ${receipt.hash}`
    );

    return NextResponse.json({
      txHash: receipt.hash,
      oracle: oracleName,
      price,
      timestamp: Date.now(),
      status: "success",
    });
  } catch (error: any) {
    console.error(`[API] Error:`, error.message);

    return NextResponse.json(
      {
        error: error.message,
        status: "error",
      },
      { status: 500 }
    );
  }
}
