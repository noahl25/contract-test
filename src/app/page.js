import { client } from './utils/client'
import contractAbi from './abi.json'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

async function getMessage() {
  return await client.readContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getMessage',
  });
}

export default async function Home() {

  const result = await getMessage();
  
  return (
    <div className="font-sans min-h-screen min-w-screen flex justify-center items-center">
      {
        result && <div>{result}</div>
      }
    </div>
  );
}
