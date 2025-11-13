/**
 * Merkle Tree implementation for receipt generation
 * Used by aggregators to create proofs for individual consumers
 */

export class MerkleTree {
  private leaves: string[]
  private layers: string[][]

  constructor(leaves: string[]) {
    this.leaves = leaves.map((leaf) => this.hash(leaf))
    this.layers = this.buildTree()
  }

  /**
   * Build the Merkle tree layers
   */
  private buildTree(): string[][] {
    const layers: string[][] = [this.leaves]

    while (layers[layers.length - 1].length > 1) {
      const currentLayer = layers[layers.length - 1]
      const nextLayer: string[] = []

      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i]
        const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left
        nextLayer.push(this.hashPair(left, right))
      }

      layers.push(nextLayer)
    }

    return layers
  }

  /**
   * Get the Merkle root
   */
  getRoot(): string {
    return this.layers[this.layers.length - 1][0]
  }

  /**
   * Get proof for a specific leaf
   */
  getProof(index: number): string[] {
    const proof: string[] = []
    let currentIndex = index

    for (let i = 0; i < this.layers.length - 1; i++) {
      const layer = this.layers[i]
      const isRightNode = currentIndex % 2 === 1
      const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1

      if (siblingIndex < layer.length) {
        proof.push(layer[siblingIndex])
      }

      currentIndex = Math.floor(currentIndex / 2)
    }

    return proof
  }

  /**
   * Verify a proof
   */
  static verify(proof: string[], root: string, leaf: string, index: number): boolean {
    let computedHash = leaf
    let currentIndex = index

    for (const proofElement of proof) {
      const isRightNode = currentIndex % 2 === 1
      computedHash = isRightNode
        ? MerkleTree.hashPair(proofElement, computedHash)
        : MerkleTree.hashPair(computedHash, proofElement)
      currentIndex = Math.floor(currentIndex / 2)
    }

    return computedHash === root
  }

  /**
   * Hash a single value
   */
  private hash(data: string): string {
    // In production, use proper keccak256
    return `0x${Buffer.from(data).toString("hex").padStart(64, "0")}`
  }

  /**
   * Hash a pair of nodes
   */
  private hashPair(left: string, right: string): string {
    const sorted = left < right ? [left, right] : [right, left]
    return this.hash(sorted.join(""))
  }

  /**
   * Static hash pair for verification
   */
  static hashPair(left: string, right: string): string {
    const sorted = left < right ? [left, right] : [right, left]
    return `0x${Buffer.from(sorted.join("")).toString("hex").padStart(64, "0")}`
  }
}

/**
 * Generate a receipt with Merkle proof
 */
export interface Receipt {
  feedId: string
  roundId: number
  consumer: string
  value: string
  timestamp: number
  merkleRoot: string
  merkleProof: string[]
  signature: string
}

export function generateReceipt(
  feedId: string,
  roundId: number,
  observations: Array<{ consumer: string; value: string }>,
  consumerAddress: string,
): Receipt {
  // Create leaves from observations
  const leaves = observations.map((obs) => JSON.stringify({ consumer: obs.consumer, value: obs.value }))

  // Build Merkle tree
  const tree = new MerkleTree(leaves)
  const root = tree.getRoot()

  // Find consumer's index
  const consumerIndex = observations.findIndex((obs) => obs.consumer === consumerAddress)

  if (consumerIndex === -1) {
    throw new Error("Consumer not found in observations")
  }

  // Get proof for consumer
  const proof = tree.getProof(consumerIndex)
  const value = observations[consumerIndex].value

  return {
    feedId,
    roundId,
    consumer: consumerAddress,
    value,
    timestamp: Date.now(),
    merkleRoot: root,
    merkleProof: proof,
    signature: "0x" + "0".repeat(130), // Placeholder for BLS signature
  }
}
