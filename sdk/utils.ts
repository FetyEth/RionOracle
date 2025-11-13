/**
 * Utility functions for RION SDK
 */

/**
 * Format feed ID to bytes32
 * @param feedId Human-readable feed ID (e.g., "BNB/USD")
 */
export function formatFeedId(feedId: string): string {
  // Convert to bytes32 format
  return "0x" + Buffer.from(feedId).toString("hex").padEnd(64, "0")
}

/**
 * Parse price value with decimals
 * @param value Raw price value
 * @param decimals Number of decimals
 */
export function parsePriceValue(value: bigint, decimals = 8): string {
  const divisor = BigInt(10 ** decimals)
  const integerPart = value / divisor
  const fractionalPart = value % divisor

  return `${integerPart}.${fractionalPart.toString().padStart(decimals, "0")}`
}

/**
 * Format BNB amount
 * @param wei Amount in wei
 */
export function formatBNB(wei: bigint): string {
  return parsePriceValue(wei, 18)
}

/**
 * Parse BNB amount to wei
 * @param bnb Amount in BNB
 */
export function parseBNB(bnb: string): bigint {
  const [integer, fractional = "0"] = bnb.split(".")
  const paddedFractional = fractional.padEnd(18, "0")
  return BigInt(integer + paddedFractional)
}

/**
 * Validate Ethereum address
 * @param address Address to validate
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Shorten address for display
 * @param address Full address
 * @param chars Number of characters to show on each side
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!isValidAddress(address)) return address
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Calculate time until timestamp
 * @param timestamp Unix timestamp
 */
export function timeUntil(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = timestamp - now

  if (diff <= 0) return "Expired"

  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  const minutes = Math.floor((diff % 3600) / 60)

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

/**
 * Format timestamp to readable date
 * @param timestamp Unix timestamp
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString()
}
