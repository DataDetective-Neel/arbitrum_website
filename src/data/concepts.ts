import type { ConceptComparison } from '../types';

export const CONCEPTS: ConceptComparison[] = [
  {
    id: 'web2-vs-web3',
    title: 'Web2 vs Web3',
    description:
      'The fundamental shift from centralized platforms to decentralized protocols.',
    sideA: {
      label: 'Web2',
      points: [
        'Centralized servers owned by companies',
        'Users create accounts controlled by the platform',
        'Data is stored and monetized by the service provider',
        'Platform can censor, modify, or revoke access',
        'Trust is placed in the company operating the service',
      ],
    },
    sideB: {
      label: 'Web3',
      points: [
        'Decentralized networks maintained by participants',
        'Users control their own identity through cryptographic keys',
        'Data is stored on distributed ledgers or decentralized storage',
        'No single entity can unilaterally censor transactions',
        'Trust is established through transparent, verifiable code',
      ],
    },
    keyTakeaway:
      'Web3 replaces institutional trust with cryptographic verification — you don\'t need to trust a company, you can verify the rules directly.',
    practicalExample:
      'In Web2, a bank holds your funds and can freeze your account. In Web3, you hold your own assets in a wallet, and only someone with your private key can authorize a transaction.',
  },
  {
    id: 'ethereum-vs-bitcoin',
    title: 'Ethereum vs Bitcoin',
    description:
      'Two blockchains with fundamentally different design goals.',
    sideA: {
      label: 'Bitcoin',
      points: [
        'Designed primarily as a digital currency and store of value',
        'Simple scripting language with limited programmability',
        'Uses Proof of Work (energy-intensive mining)',
        'Focuses on security and monetary policy predictability',
        'Transactions mainly transfer BTC between addresses',
      ],
    },
    sideB: {
      label: 'Ethereum',
      points: [
        'Designed as a programmable platform for decentralized applications',
        'Supports smart contracts — self-executing programs on-chain',
        'Uses Proof of Stake (validators stake ETH as collateral)',
        'Enables DeFi, NFTs, DAOs, and complex on-chain logic',
        'Transactions can trigger arbitrary program execution',
      ],
    },
    keyTakeaway:
      'Bitcoin is optimized to be sound digital money. Ethereum is optimized to be a general-purpose decentralized computing platform.',
    practicalExample:
      'You would use Bitcoin to send value directly to another person. You would use Ethereum to interact with a lending protocol, trade tokens on a decentralized exchange, or deploy a smart contract.',
  },
  {
    id: 'public-vs-private-key',
    title: 'Public Key vs Private Key',
    description:
      'The cryptographic pair that secures ownership and identity on a blockchain.',
    sideA: {
      label: 'Public Key',
      points: [
        'Can be shared openly with anyone',
        'Derived from the private key, but not reversible',
        'Used to generate your wallet address',
        'Others use it to send you funds or verify your signatures',
        'Functions like an email address or bank account number',
      ],
    },
    sideB: {
      label: 'Private Key',
      points: [
        'Must be kept secret at all times',
        'Used to sign transactions and prove ownership',
        'Anyone with your private key controls your assets',
        'Cannot be recovered if lost — there is no "reset password"',
        'Functions like a master password that should never be shared',
      ],
    },
    keyTakeaway:
      'Your public key identifies you. Your private key authorizes you. Losing your private key means losing access to your assets permanently.',
    practicalExample:
      'When you send cryptocurrency, you sign the transaction with your private key. The network verifies your signature using your public key to confirm you authorized the transfer.',
  },
  {
    id: 'blockchain-vs-database',
    title: 'Blockchain vs Traditional Database',
    description:
      'Two approaches to storing and managing data, with very different trust models.',
    sideA: {
      label: 'Traditional Database',
      points: [
        'Controlled by a single organization or administrator',
        'Data can be modified, deleted, or rolled back by the operator',
        'High performance — optimized for read/write speed',
        'Access is governed by the administrator\'s permission system',
        'Suitable when a trusted central authority exists',
      ],
    },
    sideB: {
      label: 'Blockchain',
      points: [
        'Distributed across many independent nodes',
        'Data is append-only — previous entries cannot be altered',
        'Slower throughput due to consensus requirements',
        'Transparent and auditable by anyone on the network',
        'Suitable when no single trusted party should have control',
      ],
    },
    keyTakeaway:
      'A blockchain sacrifices speed and efficiency in exchange for transparency, immutability, and the elimination of single points of control.',
    practicalExample:
      'A bank uses a traditional database because customers trust the bank to maintain accurate records. A decentralized currency uses a blockchain because participants should not need to trust any single entity.',
  },
];
