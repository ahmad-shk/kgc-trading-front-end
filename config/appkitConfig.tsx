import { bscTestnet, mainnet, sepolia, bsc, AppKitNetwork } from '@reown/appkit/networks';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { createAppKit } from '@reown/appkit/react';
import { environment, projectId } from './appConfig';

export const ethersAdapter = new EthersAdapter();

// const isProduction = environment === 'production';

const networks = false
  ? [bsc, mainnet]  as [AppKitNetwork, ...AppKitNetwork[]]
  : [bscTestnet, sepolia] as [AppKitNetwork, ...AppKitNetwork[]]; 



const metadata = {
    name: 'AppKit',
    description: 'AppKit Example',
    url: 'https://reown.com/appkit',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
};

// Initialize AppKit
export const modal = createAppKit({
    adapters: [new EthersAdapter()],
    networks, // Define your networks here
    projectId,
    metadata,
    // allowUnsupportedChain: false,
    features: {
        analytics: true,
        email: false,
        socials: [],
        emailShowWallets: false
    },
    featuredWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
        '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
        'dd15a3530dc4de4c50ebb22010824c41337403efec713f1187695c72934fb94c',
        '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4',
        '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709',
        '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662'
    ]
});

