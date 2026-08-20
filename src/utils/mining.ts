/* ============================================
   LAYER//LAB — Mining Utilities
   SHA-256 hashing and nonce mining using Web Crypto API
   No external blockchain libraries
   ============================================ */

/**
 * Compute SHA-256 hash of a string using Web Crypto API.
 * Returns a hex-encoded hash string.
 */
export async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compute the hash of a block given its data, previous hash, and nonce.
 */
export async function computeBlockHash(
  data: string,
  previousHash: string,
  nonce: number
): Promise<string> {
  const blockString = `${data}${previousHash}${nonce}`;
  return sha256(blockString);
}

/**
 * Difficulty prefix — the hash must start with this many zeros.
 * Using "00" (2 zeros) for a fast, responsive, but cryptographically real proof of work.
 */
export const DIFFICULTY_PREFIX = '00';

/**
 * Check if a hash satisfies the difficulty requirement.
 */
export function isValidHash(hash: string): boolean {
  return hash.startsWith(DIFFICULTY_PREFIX);
}

export interface MineResult {
  nonce: number;
  hash: string;
  attempts: number;
  durationMs: number;
}

export interface MineProgressCallback {
  (nonce: number, hash: string): void;
}

/**
 * Mine a block by incrementing the nonce until the hash starts with
 * the required difficulty prefix.
 *
 * Real SHA-256 computation with throttled UI progress reporting.
 *
 * @param data - The block data string
 * @param previousHash - The previous block's hash
 * @param startNonce - The nonce to start mining from
 * @param onProgress - Callback invoked periodically with current nonce/hash
 * @param signal - AbortSignal to cancel mining
 * @returns The successful nonce, hash, total attempts, and duration in ms
 */
export async function mineBlock(
  data: string,
  previousHash: string,
  startNonce = 0,
  onProgress?: MineProgressCallback,
  signal?: AbortSignal
): Promise<MineResult> {
  const startTime = performance.now();
  let nonce = startNonce;
  let attempts = 0;
  let lastProgressTime = 0;
  const PROGRESS_INTERVAL_MS = 40; // Throttle UI updates to ~25fps

  while (true) {
    if (signal?.aborted) {
      throw new DOMException('Mining aborted', 'AbortError');
    }

    attempts++;
    const hash = await computeBlockHash(data, previousHash, nonce);

    const now = Date.now();
    if (onProgress && now - lastProgressTime >= PROGRESS_INTERVAL_MS) {
      onProgress(nonce, hash);
      lastProgressTime = now;
      // Yield to the event loop so the UI can update
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    if (isValidHash(hash)) {
      onProgress?.(nonce, hash);
      const durationMs = Math.max(1, Math.round(performance.now() - startTime));
      return { nonce, hash, attempts, durationMs };
    }

    nonce++;
  }
}
