import Web3 from "web3";
import { USDT_Contract_Address, USDT_Contract_Abi, Payment_Contract_Address, Payment_Contract_Abi } from "./contractABI";

const testnetUSDTAdress = process.env.NEXT_PUBLIC_TEST_NET_USDT_ADRESS_URL
const testnetPAYMENTAdress = process.env.NEXT_PUBLIC_TEST_NET_PAYMENT_ADRESS_URL
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL


// Utility to initialize Web3 and validate inputs
const initializeWeb3 = () => new Web3(RPC_URL);

export const currentBalanceUSDT = async (address: any) => {
    try {

        const web3 = initializeWeb3();
        const contractOfUSDT = new web3.eth.Contract(
            USDT_Contract_Abi,
            USDT_Contract_Address
        );

        let rawBalance = await contractOfUSDT.methods.balanceOf(address).call() as string;
        let formattedBalance = web3.utils.fromWei(rawBalance, 'mwei'); // USDT = 6 decimals
        return formattedBalance;
    }
    catch (e) {
        return e
    }

}

export const currentBalance = async (address: any) => {
    try {
      const web3 = initializeWeb3(); // Must return a valid Web3 instance
  
      // Get native BNB balance (18 decimals)
      const rawBNBBalance = await web3.eth.getBalance(address);
      const bnbBalance = web3.utils.fromWei(rawBNBBalance, 'ether');
  
      // Get USDT token balance (6 decimals)
      const contractOfUSDT = new web3.eth.Contract(USDT_Contract_Abi, USDT_Contract_Address);
      const rawUSDTBalance = await contractOfUSDT.methods.balanceOf(address).call() as string;
      //   const balanceUSDT= web3.utils.fromWei(balanceUSDT.toString());
      const usdtBalance = web3.utils.fromWei(rawUSDTBalance, 'ether');
    //   const usdtBalance = web3.utils.fromWei(rawUSDTBalance.toString());
  
      return {
        bnb: bnbBalance,
        usdt: usdtBalance,
      };
    } catch (e) {
      console.error('Error fetching balances:', e);
      return null;
    }
  };