import { ethers } from "ethers";

const PREDICTION_MARKET_ABI = [
  "function placePrediction(address aggregator, uint8 predictedOutcome) external payable returns (uint256)",
  "function markets(uint256) external view returns (bytes32 matchId, bytes32 feedId, uint8 marketType, uint8 status, uint8 result, uint256 lockTime, uint256 resolveTime, int256 line, uint256 totalStakedHome, uint256 totalStakedAway, uint256 totalStakedOver, uint256 totalStakedUnder)",
  "function marketCount() external view returns (uint256)",
  "function claimPrediction(uint256 predictionId) external",
  "function isAggregatorRegistered(address aggregator) external view returns (bool)",
  "function registerAggregator(address aggregator) external",
  "function getRegisteredAggregators() external view returns (address[])",
  "event PredictionPlaced(uint256 indexed predictionId, address indexed user, uint256 indexed marketId, uint8 outcome, uint256 amount)",
];

const AGGREGATOR_ABI = [
  "function placeBet(uint8 outcome) external payable returns (uint256)",
  "function claimWinnings(uint256 betId) external",
  "function getBet(uint256 betId) external view returns (address bettor, uint8 outcome, uint256 amount, bool claimed, uint256 timestamp)",
  "function totalBets() external view returns (uint256)",
  "function marketResolved() external view returns (bool)",
  "function winningOutcome() external view returns (uint8)",
];

const BSC_TESTNET_CHAIN_ID = BigInt(97);
const BSC_TESTNET_CHAIN_ID_HEX = "0x61";

function getEthereumProvider(): any {
  if (typeof window === "undefined") return null;

  if (!window.ethereum) {
    throw new Error(
      "No Ethereum wallet detected. Please install MetaMask or another EVM wallet."
    );
  }

  if ((window.ethereum as any).providers?.length) {
    const metaMask = (window.ethereum as any).providers.find(
      (p: any) => p.isMetaMask && !p.isPhantom
    );
    if (metaMask) return metaMask;

    const evmProvider = (window.ethereum as any).providers.find(
      (p: any) => !p.isPhantom
    );
    if (evmProvider) return evmProvider;
  }

  if (
    (window.ethereum as any).isPhantom &&
    !(window.ethereum as any).isMetaMask
  ) {
    throw new Error(
      "Phantom wallet detected, but it's a Solana wallet. " +
        "Please install MetaMask, Trust Wallet, or another EVM wallet for BSC Testnet."
    );
  }

  return window.ethereum;
}

export interface PlacedBet {
  id: string;
  txHash: string;
  gameId: string;
  selectedTeam: string;
  amount: string;
  odds: number;
  potentialWin: number;
  status: "pending" | "won" | "lost" | "claimed"; // Added "claimed" status
  timestamp: number;
  market: string;
  betType: string;
  outcome: number;
  aggregator: string;
}

export class PredictionMarket {
  private contract: ethers.Contract;
  private provider: ethers.BrowserProvider;
  private signer: ethers.Signer | null = null;

  constructor() {
    if (typeof window === "undefined") {
      throw new Error("PredictionMarket can only be used in the browser");
    }

    const contractAddress =
      process.env.NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS ||
      "0x1cc2d79A181D26A732cbFaD33eC9Bf03C3A96287";
    if (!contractAddress || contractAddress === "undefined") {
      throw new Error(
        "NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS is not set. " +
          "Please add it to your environment variables with the value: 0x1cc2d79A181D26A732cbFaD33eC9Bf03C3A96287"
      );
    }

    const ethereumProvider = getEthereumProvider();
    this.provider = new ethers.BrowserProvider(ethereumProvider);
    this.contract = new ethers.Contract(
      contractAddress,
      PREDICTION_MARKET_ABI,
      this.provider
    );
  }

  async connect() {
    const ethereumProvider = getEthereumProvider();
    this.provider = new ethers.BrowserProvider(ethereumProvider);

    const currentNetwork = await this.provider.getNetwork();

    if (currentNetwork.chainId !== BSC_TESTNET_CHAIN_ID) {
      try {
        await ethereumProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BSC_TESTNET_CHAIN_ID_HEX }],
        });

        this.provider = new ethers.BrowserProvider(ethereumProvider);
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await ethereumProvider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: BSC_TESTNET_CHAIN_ID_HEX,
                  chainName: "BNB Smart Chain Testnet",
                  nativeCurrency: {
                    name: "tBNB",
                    symbol: "tBNB",
                    decimals: 18,
                  },
                  rpcUrls: ["https://data-seed-prebsc-1-s1.bnbchain.org:8545"],
                  blockExplorerUrls: ["https://testnet.bscscan.com"],
                },
              ],
            });

            this.provider = new ethers.BrowserProvider(ethereumProvider);
          } catch (addError) {
            throw new Error(
              "Failed to add BSC Testnet to your wallet. Please add it manually:\n" +
                "Network Name: BNB Smart Chain Testnet\n" +
                "RPC URL: https://data-seed-prebsc-1-s1.bnbchain.org:8545\n" +
                "Chain ID: 97\n" +
                "Currency: tBNB\n" +
                "Explorer: https://testnet.bscscan.com"
            );
          }
        } else {
          throw new Error(
            "Please switch to BNB Smart Chain Testnet (Chain ID: 97) in your wallet to continue."
          );
        }
      }
    }

    this.signer = await this.provider.getSigner();
    this.contract = this.contract.connect(this.signer) as ethers.Contract;

    return this.signer.getAddress();
  }

  async getBalance(): Promise<string> {
    if (!this.signer) {
      await this.connect();
    }

    const address = await this.signer!.getAddress();
    const signerProvider = this.signer!.provider;
    if (!signerProvider) {
      throw new Error("Provider not available");
    }

    const balance = await signerProvider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);

    return balanceInEth;
  }

  async placeBet(
    gameId: string,
    selectedTeam: string,
    outcome: number,
    amount: string,
    odds: number,
    market: string,
    betType: string,
    aggregatorAddress: string
  ): Promise<PlacedBet> {
    if (!this.signer) {
      await this.connect();
    }

    if (!aggregatorAddress || aggregatorAddress === "undefined") {
      throw new Error(
        `Invalid aggregator address. Make sure the game's aggregator is configured in your environment variables.`
      );
    }

    const amountWei = ethers.parseEther(amount);

    // Contract expects: 1 = HOME_WIN, 2 = AWAY_WIN, 3 = DRAW/OVER/UNDER
    let predictedOutcome: number;
    if (market === "moneyline") {
      predictedOutcome = outcome + 1; // 0 → 1 (home), 1 → 2 (away)
    } else if (market === "totals") {
      predictedOutcome = 3; // Using outcome 3 for totals markets
    } else {
      predictedOutcome = outcome + 1; // Convert any other outcome to 1-based
    }

    try {
      const aggregatorContract = new ethers.Contract(
        aggregatorAddress,
        AGGREGATOR_ABI,
        this.signer
      );

      const address = await this.signer!.getAddress();
      const balance = await this.provider.getBalance(address);

      if (balance < amountWei) {
        throw new Error(
          `Insufficient balance. You have ${ethers.formatEther(
            balance
          )} tBNB but trying to bet ${amount} tBNB`
        );
      }

      const network = await this.provider.getNetwork();

      if (network.chainId !== BSC_TESTNET_CHAIN_ID) {
        throw new Error(
          `Wrong network. Please switch to BSC Testnet (Chain ID: 97). Current: ${network.chainId}`
        );
      }

      try {
        const gasEstimate = await aggregatorContract.placeBet.estimateGas(
          predictedOutcome,
          {
            value: amountWei,
          }
        );
      } catch (gasError: any) {
        throw new Error(
          `Cannot place bet: ${
            gasError.message || "Gas estimation failed"
          }. This usually means:\n\n` +
            `1. The betting period has closed for this game\n` +
            `2. The market has already been resolved\n` +
            `3. The selected outcome is invalid\n` +
            `4. The aggregator contract is not accepting bets\n\n` +
            `Please try a different game or check if betting is still open.`
        );
      }

      const tx = await aggregatorContract.placeBet(predictedOutcome, {
        value: amountWei,
        gasLimit: 500000,
      });

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error(
          `Transaction reverted. The contract rejected your bet. This usually means:\n\n` +
            `1. Betting is closed for this game\n` +
            `2. The market has already been resolved\n` +
            `3. Invalid outcome selected\n\n` +
            `View transaction: https://testnet.bscscan.com/tx/${receipt.hash}`
        );
      }

      let betId = Date.now().toString();
      try {
        const totalBets = await aggregatorContract.totalBets();
        betId = (totalBets - BigInt(1)).toString(); // Last bet ID
      } catch (error) {
        console.log(error);
      }

      const placedBet: PlacedBet = {
        id: betId,
        txHash: receipt.hash,
        gameId,
        selectedTeam,
        amount,
        odds,
        potentialWin: Number.parseFloat(amount) * odds,
        status: "pending",
        timestamp: Date.now(),
        market,
        betType,
        outcome,
        aggregator: aggregatorAddress,
      };

      this.storeBet(placedBet);

      return placedBet;
    } catch (error: any) {
      console.error(error);

      if (error.message?.includes("insufficient funds")) {
        throw new Error(
          "Insufficient funds. Please add more tBNB to your wallet."
        );
      }

      if (error.message?.includes("user rejected")) {
        throw new Error("Transaction was rejected in your wallet.");
      }

      throw new Error(
        error.message || "Failed to place bet. Please try again."
      );
    }
  }

  private storeBet(bet: PlacedBet) {
    const bets = this.getUserBets();
    bets.push(bet);

    document.cookie = `rion_bets=${JSON.stringify(bets)}; path=/; max-age=${
      30 * 24 * 60 * 60
    }; SameSite=Lax`;
  }

  getUserBets(): PlacedBet[] {
    if (typeof document === "undefined") return [];

    const cookies = document.cookie.split("; ");
    const betsCookie = cookies.find((c) => c.startsWith("rion_bets="));

    if (!betsCookie) return [];

    try {
      const betsJson = betsCookie.split("=")[1];
      return JSON.parse(decodeURIComponent(betsJson));
    } catch (error) {
      return [];
    }
  }

  async updateBetStatuses(
    bets: PlacedBet[],
    games: any[]
  ): Promise<PlacedBet[]> {
    const updatedBets = await Promise.all(
      bets.map(async (bet) => {
        const game = games.find((g) => g.id === bet.gameId);

        if (!game || game.status !== "final" || bet.status !== "pending") {
          return bet;
        }

        let won = false;

        if (bet.market === "moneyline") {
          if (bet.outcome === 0) {
            won = game.homeScore > game.awayScore;
          } else {
            won = game.awayScore > game.homeScore;
          }
        }

        return {
          ...bet,
          status: won ? ("won" as const) : ("lost" as const),
        };
      })
    );

    document.cookie = `rion_bets=${JSON.stringify(
      updatedBets
    )}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;

    return updatedBets;
  }

  async claimWinnings(
    predictionId: string,
    aggregatorAddress: string
  ): Promise<string> {
    if (!this.signer) {
      await this.connect();
    }

    const aggregatorContract = new ethers.Contract(
      aggregatorAddress,
      AGGREGATOR_ABI,
      this.signer
    );

    const tx = await aggregatorContract.claimWinnings(predictionId);
    const receipt = await tx.wait();

    return receipt.hash;
  }

  async createMarket(
    matchId: string,
    lockTime: number,
    line = 0
  ): Promise<string> {
    if (!this.signer) {
      await this.connect();
    }

    const contractWithSigner = this.contract.connect(
      this.signer!
    ) as ethers.Contract;

    const matchIdBytes32 = ethers.id(matchId);
    const feedIdBytes32 = ethers.id(`feed-${matchId}`);

    const tx = await contractWithSigner.createMarket(
      matchIdBytes32,
      feedIdBytes32,
      0,
      lockTime,
      line,
      {
        gasLimit: 500000,
      }
    );

    const receipt = await tx.wait();

    if (receipt.status === 0) {
      throw new Error("Market creation failed - transaction reverted");
    }

    return receipt.hash;
  }

  async getMarketCount(): Promise<number> {
    const count = await this.contract.marketCount();
    return Number(count);
  }

  async getMarket(marketId: number): Promise<any> {
    const market = await this.contract.markets(marketId);
    return {
      matchId: market.matchId,
      feedId: market.feedId,
      marketType: market.marketType,
      status: market.status,
      result: market.result,
      lockTime: Number(market.lockTime),
      resolveTime: Number(market.resolveTime),
      line: Number(market.line),
      totalStakedHome: ethers.formatEther(market.totalStakedHome),
      totalStakedAway: ethers.formatEther(market.totalStakedAway),
    };
  }

  getBscScanLink(txHash: string): string {
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
    const isTestnet = chainId === "97";
    const baseUrl = isTestnet
      ? "https://testnet.bscscan.com"
      : "https://bscscan.com";
    return `${baseUrl}/tx/${txHash}`;
  }

  async checkAggregatorStatus(aggregatorAddress: string): Promise<{
    isRegistered: boolean;
    contractAddress: string;
    bscScanLink: string;
  }> {
    const contractAddress =
      process.env.NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS ||
      "0x1cc2d79A181D26A732cbFaD33eC9Bf03C3A96287";

    try {
      const isRegistered = await this.contract.isAggregatorRegistered(
        aggregatorAddress
      );
      return {
        isRegistered,
        contractAddress,
        bscScanLink: `https://testnet.bscscan.com/address/${contractAddress}#writeContract`,
      };
    } catch (error) {
      return {
        isRegistered: false,
        contractAddress,
        bscScanLink: `https://testnet.bscscan.com/address/${contractAddress}#writeContract`,
      };
    }
  }

  async getRegisteredAggregators(): Promise<string[]> {
    try {
      const aggregators = await this.contract.getRegisteredAggregators();
      return aggregators;
    } catch (error) {
      return [];
    }
  }

  async checkBetStatus(
    betId: string,
    aggregatorAddress: string
  ): Promise<{
    canClaim: boolean;
    isResolved: boolean;
    winningOutcome: number;
  }> {
    if (!this.signer) {
      await this.connect();
    }

    const aggregatorContract = new ethers.Contract(
      aggregatorAddress,
      AGGREGATOR_ABI,
      this.signer
    );

    try {
      const [bet, isResolved, winningOutcome] = await Promise.all([
        aggregatorContract.getBet(betId),
        aggregatorContract.marketResolved(),
        aggregatorContract.winningOutcome().catch(() => 0),
      ]);

      const [bettor, outcome, amount, claimed, timestamp] = bet;

      const canClaim = isResolved && !claimed && outcome === winningOutcome;

      return {
        canClaim,
        isResolved,
        winningOutcome: Number(winningOutcome),
      };
    } catch (error) {
      return {
        canClaim: false,
        isResolved: false,
        winningOutcome: 0,
      };
    }
  }
}

export const GAME_AGGREGATORS = [
  process.env.NEXT_PUBLIC_GAME_1_AGGREGATOR,
  process.env.NEXT_PUBLIC_GAME_2_AGGREGATOR,
  process.env.NEXT_PUBLIC_GAME_3_AGGREGATOR,
  process.env.NEXT_PUBLIC_GAME_4_AGGREGATOR,
  process.env.NEXT_PUBLIC_GAME_5_AGGREGATOR,
].filter((addr): addr is string => !!addr);

export const MAX_GAMES = GAME_AGGREGATORS.length;

export function getAggregatorForGame(gameIndex: number): string {
  if (gameIndex < 0 || gameIndex >= MAX_GAMES) {
    throw new Error(
      `Game index ${gameIndex} is out of range (0-${MAX_GAMES - 1})`
    );
  }

  const aggregator = GAME_AGGREGATORS[gameIndex];
  if (!aggregator || aggregator === "undefined") {
    throw new Error(
      `Aggregator for game ${gameIndex + 1} not configured. ` +
        `Make sure NEXT_PUBLIC_GAME_${
          gameIndex + 1
        } is set in your environment variables.`
    );
  }

  return aggregator;
}
