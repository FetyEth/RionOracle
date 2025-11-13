"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { getNetworkConfig } from "@/lib/contracts"

export function NetworkStatus() {
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const checkNetwork = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const chainIdHex = await window.ethereum.request({ method: "eth_chainId" })
          const id = Number.parseInt(chainIdHex, 16)
          setChainId(id)
          setIsConnected(true)
        } catch (error) {
          console.error("Failed to get chain ID:", error)
        }
      }
    }

    checkNetwork()

    if (window.ethereum) {
      window.ethereum.on("chainChanged", (chainIdHex: string) => {
        const id = Number.parseInt(chainIdHex, 16)
        setChainId(id)
      })
    }
  }, [])

  if (!isConnected || !chainId) {
    return (
      <Badge variant="outline" className="bg-muted/50">
        Not Connected
      </Badge>
    )
  }

  try {
    const network = getNetworkConfig(chainId)
    return (
      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
        {network.name}
      </Badge>
    )
  } catch {
    return (
      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
        Wrong Network
      </Badge>
    )
  }
}

declare global {
  interface Window {
    ethereum?: any
  }
}
