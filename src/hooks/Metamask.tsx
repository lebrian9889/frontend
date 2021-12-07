import { useEffect, useState } from 'react';
import Account from '../types/Account';
import { ethers } from "ethers";

function useMetamask() {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    if (!window.ethereum) {
      alert("Please install Metamask");
    }

    (async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum, {
        name: process.env.REACT_APP_ETH_CHAIN_NAME!,
        chainId: Number.parseInt(process.env.REACT_APP_ETH_CHAIN_ID!),
      });
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      console.log(provider.network)

      setAccount({
        address
      })
    })()
  }, [])

  return account;
}

export default useMetamask;