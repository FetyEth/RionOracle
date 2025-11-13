export const SIMPLE_AGGREGATOR_ABI = [
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint256", name: "roundId", type: "uint256" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "uint256", name: "observationCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "roundId", type: "uint256" }],
    name: "getRoundData",
    outputs: [
      {
        components: [
          { internalType: "int256", name: "answer", type: "int256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "uint256", name: "observationCount", type: "uint256" },
          { internalType: "bool", name: "finalized", type: "bool" },
        ],
        internalType: "struct SimpleAggregator.RoundData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "authorizedOracles",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const
