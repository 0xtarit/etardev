import { ethers } from "ethers";
import { createProvider , setProvider} from "./createProvider";

type responseRpcUrlType = {
  status: boolean;
  message: string;
  rpcProtocolType?: string;
  provider?: ethers.Provider;
};

// Function to check the protocol type of an RPC URL
const checkRpcUrlProtocol = async (_rpcUrl: string): Promise<responseRpcUrlType> => {
  try {
    const protocol: string = new URL(_rpcUrl).protocol; // 'https:', 'http:', 'wss:', etc.

    if (!protocol) {
      return { status: false, message: "Invalid RPC Url." };
    }

    let protocolType = ["wss:", "https:", "http:"];

    if (protocolType.includes(protocol)) {
      
      try {
        
        const payload = {
          method: "eth_blockNumber",
          params: [],
        };

        const response = await fetch(_rpcUrl, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 200) {
          return { status: true, message: "RPC URL is valid and accessible.", rpcProtocolType: protocol };
        } else {
          return { status: false, message: `RPC URL not responded with status: ${response.status}` };
        }

      } catch (fetchError) {
        return { status: false, message: "RPC URL is not reachable." };
      }

    } else {
      return { status: false, message: "Protocol is invalid." };
    }

  } catch (error) {
    return { status: false, message: "Invalid RPC Url." };
  }
};

// Function to validate an RPC URL and check block request if needed
const checkRpcUrl = async ( _url: string, _blockRequest?: boolean ): Promise<responseRpcUrlType> => {
  let rpcUrl: string = _url;
  let protocolResult: responseRpcUrlType = await checkRpcUrlProtocol(rpcUrl);

  if (protocolResult.status) {
    if (_blockRequest) {
      let providerResult = await createProvider(_url, true);

      if (providerResult.status) {
        return { status: true, provider: providerResult.provider, message: providerResult.message,};
      } else {
        return {status: false,message: "RPC Url is invalid for block request.",};
      }

    } else {
      return { status: true, message: "RPC Url is valid." };
    }
  } else {
    return protocolResult;
  }
};

export { checkRpcUrlProtocol, checkRpcUrl };
