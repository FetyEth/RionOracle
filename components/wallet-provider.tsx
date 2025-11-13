"use client";

import type React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  trustWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
} from "@rainbow-me/rainbowkit/wallets";
import "@rainbow-me/rainbowkit/styles.css";

// ---- hardcoded WalletConnect projectId & RPC (change to yours if needed) ----
const WALLETCONNECT_PROJECT_ID = "2241e120c2f6d3d1dca3a2da37cdff50"; // put your real one
const RPC_URL = "https://data-seed-prebsc-1-s1.bnbchain.org:8545";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet,
        trustWallet,
        coinbaseWallet,
        walletConnectWallet,
        rainbowWallet,
      ],
    },
  ],
  {
    appName: "rion-oracle",
    projectId: WALLETCONNECT_PROJECT_ID,
  }
);

const config = createConfig({
  connectors,
  chains: [bscTestnet],
  transports: { [bscTestnet.id]: http(RPC_URL) },
  multiInjectedProviderDiscovery: false,
  ssr: true,
});

const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={bscTestnet}
          theme={darkTheme({
            accentColor: "#D0FF00",
            accentColorForeground: "black",
            borderRadius: "large",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
