import { ethers } from "ethers";
import { checkRpcUrlProtocol } from "./checkRpcUrl";

type responseRpcUrlType = {
  status: boolean;
  message: string;
  rpcProtocolType?: string;
  provider?: ethers.Provider;
};

// Async function to create a provider and validate its response
const setProvider = async ( _rpcUrl: string, _rpcUrlType: string ): Promise<responseRpcUrlType> => {
  let rpcUrlProtocolType = _rpcUrlType;
  let _providerRpcUrl = _rpcUrl;

  let provider: ethers.Provider | null = null;

  try {

    if (rpcUrlProtocolType === "wss:") {
      provider = new ethers.WebSocketProvider(_providerRpcUrl);
    } else if ( rpcUrlProtocolType === "https:" || rpcUrlProtocolType === "http:" ) { 
      provider = new ethers.JsonRpcProvider(_providerRpcUrl);
    } else {
      return { status: false, message: "Unsupported protocol type." };
    }

    // 🔥 First, check if provider can detect network
    try {
      const network = await provider.getNetwork();
      console.log(`✅ Connected to network: ${network.name} (chainId: ${network.chainId})`);
    } catch (error: any) {
      return { status: false, message: `❌ Invalid network: ${error.message}` };
    }

    // Verify if provider works by fetching the block number
    try {
      const blockNumber = await provider.getBlockNumber();
      if (blockNumber && Number(blockNumber) > 0) {
        return { status: true, message: `Provider created. Latest Block Number: ${blockNumber}`, provider: provider, };
      } else {
        return { status: false, message: "RPC Url is invalid for block request.",};
      }
    } catch (error: any) {
      return { status: false, message: `Error creating provider: ${error.message}`,};
    }

  } catch (error: any) {
    return { status: false, message: `Error creating provider: ${error.message}`,};
  }

};

// Function to create and validate a provider
const createProvider = async ( _providerRpcUrl: string, _checkProviderRpcUrl?: boolean): Promise<responseRpcUrlType> => {
  let checkRpcUrlProtocolResult: responseRpcUrlType = await checkRpcUrlProtocol(_providerRpcUrl);

  if (checkRpcUrlProtocolResult.status) {
    const rpcProtocolType_result = checkRpcUrlProtocolResult.rpcProtocolType;

    if (!rpcProtocolType_result) {
      return { status: false, message: "RPC protocol type is undefined." };
    }

    let setProviderResult: responseRpcUrlType = await setProvider(_providerRpcUrl,rpcProtocolType_result);

    if (setProviderResult.status) {
      return setProviderResult;
    } else {
      return { status: false, message: "Failed to create provider." };
    }
  } else {
    return checkRpcUrlProtocolResult;
  }
};

export { createProvider , setProvider};