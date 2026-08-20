import type { ConceptComparison } from '../types';

export const CONCEPTS: ConceptComparison[] = [
  {
    id: 'web2-vs-web3',
    title: 'Web2 vs Web3',
    description:
      'The architectural evolution from centralized platform silos to open, cryptographically verifiable protocols.',
    sideA: {
      label: 'Web2 (Platform Architecture)',
      points: [
        'Centralized servers owned and operated by corporate entities',
        'User accounts, access permissions, and profiles controlled by the host',
        'Data stored in proprietary databases and monetized by the platform',
        'Unilateral ability to censor, alter state, or revoke user access',
        'Trust model relies on corporate policies and institutional reputation',
      ],
    },
    sideB: {
      label: 'Web3 (Protocol Architecture)',
      points: [
        'Decentralized peer-to-peer node networks executing shared consensus',
        'Self-sovereign identity managed directly via cryptographic keypairs',
        'State stored across distributed, transparent, and append-only ledgers',
        'Deterministic execution rules enforced by immutable smart contracts',
        'Trust model relies on open-source, mathematically verifiable code',
      ],
    },
    keyTakeaway:
      'Web3 shifts the trust paradigm from subjective institutional promises to objective cryptographic verification. Users retain custody of their data and assets.',
    practicalExample:
      'In Web2, a financial service or cloud provider can freeze an account or change platform rules overnight. In Web3, users retain custody of their private keys and interact with deterministic protocols that execute according to public rules.',
  },
  {
    id: 'ethereum-vs-bitcoin',
    title: 'Ethereum vs Bitcoin',
    description:
      'Two foundational blockchains designed around fundamentally different architectural goals.',
    sideA: {
      label: 'Bitcoin (Hard Digital Money)',
      points: [
        'Primary design goal: Secure, predictable, censorship-resistant digital store of value',
        'Intentionally constrained scripting language (Script) to minimize attack surface',
        'Consensus mechanism: Proof of Work (PoW) with Nakamoto consensus',
        'Accounting model: Unspent Transaction Output (UTXO)',
        'Optimized for monetary policy stability and conservative protocol changes',
      ],
    },
    sideB: {
      label: 'Ethereum (Programmable State Machine)',
      points: [
        'Primary design goal: General-purpose decentralized computation platform',
        'Turing-complete execution environment (Ethereum Virtual Machine / EVM)',
        'Consensus mechanism: Proof of Stake (PoS) with validator collateral',
        'Accounting model: Account-based state machine (EOAs and contract accounts)',
        'Optimized for expressive smart contracts, DeFi, DAOs, and Layer 2 rollups',
      ],
    },
    keyTakeaway:
      'Bitcoin prioritizes simplicity, security, and monetary predictability as digital gold. Ethereum prioritizes programmability, serving as a global decentralized computer.',
    practicalExample:
      'Bitcoin is used to transfer and store monetary value directly peer-to-peer. Ethereum is used to run automated market makers, decentralized lending pools, dynamic NFTs, and Layer 2 optimistic rollups like Arbitrum.',
  },
  {
    id: 'public-vs-private-key',
    title: 'Public Key vs Private Key',
    description:
      'The asymmetric cryptographic keypair establishing identity, ownership, and authorization.',
    sideA: {
      label: 'Public Key (Identity & Verification)',
      points: [
        'Can be freely shared across public networks without compromising security',
        'Mathematically derived from the private key via one-way elliptic curve cryptography',
        'Used by network participants to verify signatures created by the private key',
        'Hashed to derive human-readable blockchain account addresses',
        'Analogous to a routing number, IBAN, or public email address',
      ],
    },
    sideB: {
      label: 'Private Key (Authorization & Signing)',
      points: [
        'Must remain strictly secret; anyone with access commands the account',
        'Used to create non-forgeable digital signatures that authorize transactions',
        'Impossible to reverse-engineer from the public key or account address',
        'Loss or compromise is permanent; decentralized systems have no password reset',
        'Analogous to an unforgeable physical signature or cryptographic master credential',
      ],
    },
    keyTakeaway:
      'Your public key (and derived address) tells the world where to send assets and how to verify your signature. Your private key authorizes state changes and grants absolute custody.',
    practicalExample:
      'When sending a transaction on Arbitrum, your wallet signs the transaction payload using your private key. Validators and nodes use your public key to verify that the signature was generated by the rightful owner before executing.',
  },
  {
    id: 'blockchain-vs-database',
    title: 'Blockchain vs Traditional Database',
    description:
      'Understanding the engineering tradeoffs between centralized efficiency and distributed trustlessness.',
    sideA: {
      label: 'Traditional Database (e.g., PostgreSQL)',
      points: [
        'Controlled by a single centralized administrator or cloud organization',
        'Full CRUD operations (Create, Read, Update, Delete) with mutable history',
        'High throughput with sub-millisecond query and write latency',
        'Optimized for computational efficiency and administrative flexibility',
        'Single point of failure or regulatory jurisdiction if not multi-region replicated',
      ],
    },
    sideB: {
      label: 'Blockchain (Distributed Ledger)',
      points: [
        'Maintained by a decentralized network of mutually untrusted validator nodes',
        'Append-only architecture where historical state transitions cannot be altered',
        'Lower throughput due to global peer-to-peer consensus and verification overhead',
        'Optimized for censorship resistance, transparency, and Byzantine fault tolerance',
        'No single entity can rewrite history, roll back settled state, or halt consensus',
      ],
    },
    keyTakeaway:
      'Blockchains trade write performance and storage efficiency for immutable history, transparent auditability, and decentralized consensus without single points of failure.',
    practicalExample:
      'A ride-sharing app uses a traditional database to track driver locations in real time with high throughput. A settlement protocol uses a blockchain so no single financial institution can alter account balances or erase transaction records.',
  },
];
