'use client'

import { client } from './utils/utils'
import contractAbi from './abi.json'
import { useEffect, useRef, useState } from 'react';
import { createWalletClient } from 'viem';
import { custom } from 'viem';
import { sepolia } from 'viem/chains';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

async function getMessage() {
  return await client.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getMessage',
  });
}

const getAccount = async () => {
  return await window.ethereum.request({ method: 'eth_requestAccounts' });
}

const switchToSepolia = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xAA36A7' }], 
    });
  } catch (switchError) {
    console.error(switchError);
  }
};

const write = async (account, msg) => {

  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });

  return await walletClient.writeContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'setMessage',
    args: [msg],
    account, 
  });

}

export default function Home() {

  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {

    getMessage().then((data) => {
      setResult(data);
    });

  }, []);

  const onClick = () => {

    getAccount().then((data1) => {
      
      switchToSepolia().then(() => {
        write(data1[0], inputRef.current.value);
      })

    });

    
  }
  
  return (
    <div className="font-sans min-h-screen min-w-screen flex justify-center items-center flex-col gap-5">
      {
        result && <div>{result}</div>
      }
      <div className=''>
        <input type="text" ref={inputRef} className='bg-white block text-black'></input>
        <button onClick={onClick} className='hover:text-red-500'>Set New Message</button>
      </div>
    </div>
  );
}
