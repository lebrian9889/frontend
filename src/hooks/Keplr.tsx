import { useEffect, useState } from 'react';
import Account from '../types/Account';

function useKeplr() {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    if (!window.keplr) {
      alert("Please install Keplr");
    }
    
    (async () => {
      await window.keplr.experimentalSuggestChain({
        chainId: "aeternalism",
        chainName: "Aeternalism",
        rpc: process.env.REACT_APP_AES_RPC,
        rest: process.env.REACT_APP_AES_RES,
        bip44: {
          coinType: 118,
        },
        bech32Config: {
          bech32PrefixAccAddr: "aes",
          bech32PrefixAccPub: "aespub",
          bech32PrefixValAddr: "aesvaloper",
          bech32PrefixValPub: "aesvaloperpub",
          bech32PrefixConsAddr: "aesvalcons",
          bech32PrefixConsPub: "aesvalconspub",
        },
        currencies: [
          {
            coinDenom: "AES",
            coinMinimalDenom: "uaes",
            coinDecimals: 6,
            coinGeckoId: "aes",
          },
        ],
        feeCurrencies: [
          {
            coinDenom: "AES",
            coinMinimalDenom: "uaes",
            coinDecimals: 6,
            coinGeckoId: "aes",
          },
        ],
        stakeCurrency: {
          coinDenom: "AES",
          coinMinimalDenom: "uaes",
          coinDecimals: 6,
          coinGeckoId: "aes",
        },
        coinType: 118,
        gasPriceStep: {
          low: 0,
          average: 0,
          high: 0,
        },
      });

      const signer = window.keplr.getOfflineSigner("aeternalism");
      const accounts = await signer.getAccounts();

      setAccount({
        address: accounts[0].address
      });
    })()
  }, [])

  return account;
}

export default useKeplr;