'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// USDT contract address (Ethereum mainnet example)
const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

// Minimal ERC-20 ABI
const ERC20_ABI = [
    {
        constant: true,
        name: 'balanceOf',
        type: 'function',
        inputs: [{ name: '_owner', type: 'address' }],
        outputs: [{ name: 'balance', type: 'uint256' }],
    },
    {
        constant: true,
        name: 'decimals',
        type: 'function',
        inputs: [],
        outputs: [{ name: '', type: 'uint8' }],
    },
];

const useUSDTBalance = (walletAddress?: string) => {
    const [balance, setBalance] = useState<string | null>(null);

    useEffect(() => {
        console.log('Fetching USDT balance for wallet:', walletAddress);
        fetchUSDTBalance()
    }, [walletAddress]);
    const fetchUSDTBalance = async () => {

        try{
            if (!walletAddress || typeof window === 'undefined' || !window.ethereum) return;

            const provider = new ethers.BrowserProvider(window.ethereum as any);
            const contract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, provider);
    
            const [rawBalance, decimals] = await Promise.all([
                contract.balanceOf(walletAddress),
                contract.decimals(),
            ]);
    
            const formatted = ethers.formatUnits(rawBalance, decimals);
            console.log('Fetching USDT balance for wallet:', formatted);
    
            setBalance(formatted);
        }catch (error) {
            console.error('Error fetching USDT balance:', error);
            setBalance(null);
        }
        
    };
    return balance;
};

export default useUSDTBalance;
