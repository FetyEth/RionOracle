"use client";

import type React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: "sm" | "md";
};

const WalletConnectButton: React.FC<Props> = ({ className, size = "md" }) => {
  const height = size === "sm" ? "h-9 px-4 text-sm" : "h-10 px-6 text-sm";

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
        authenticationStatus,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        const baseBtn =
          "inline-flex items-center justify-center rounded-full " +
          "bg-[#D0FF00] text-black hover:bg-[#D0FF00]/90 transition-colors " +
          "font-medium " +
          height;

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              type="button"
              className={cn(baseBtn, className)}
            >
              Connect Wallet
            </button>
          );
        }

        // Wrong network
        if (chain.unsupported) {
          return (
            <button
              onClick={openChainModal}
              type="button"
              className={cn(baseBtn, "bg-red-500 hover:bg-red-600", className)}
            >
              Wrong network
            </button>
          );
        }

        // Connected: show chain icon + account label
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={openChainModal}
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#0f0f0f] text-[#E5E5E5] hover:bg-[#E5E5E5]/10 transition-colors h-10 px-4 text-sm"
              aria-label="Select network"
              title={chain.name ?? "Network"}
            >
              {chain.hasIcon && chain.iconUrl && (
                <span
                  className="w-4 h-4 rounded-full overflow-hidden"
                  style={{ background: chain.iconBackground }}
                >
                  <img
                    alt={chain.name ?? "Chain"}
                    src={chain.iconUrl || "/placeholder.svg"}
                    className="w-4 h-4"
                  />
                </span>
              )}
              <span className="truncate max-w-[8rem]">{chain.name}</span>
            </button>

            <button
              onClick={openAccountModal}
              type="button"
              className={cn(baseBtn, className)}
              aria-label="Open wallet"
            >
              {account.displayName}
              {account.displayBalance ? ` · ${account.displayBalance}` : ""}
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletConnectButton;
