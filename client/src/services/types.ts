export type BlockChain = {
    index: number
    timestamp: number
    previousHash: string
    data: Record<string, unknown>
    hash: string
    nonce: number
}
