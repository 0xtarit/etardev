import { ethers , Provider} from "ethers";
import { checkRpcUrlProtocol } from "./checkRpcUrl";
import { responseType } from "../import/responseType";


// Async function to create a provider and validate its response
const setProvider = async ( _rpcUrl: string, _rpcUrlType: string, _byRequestSend: boolean = false): Promise<responseType> => {
  let rpcUrlProtocolType = _rpcUrlType;
  let _providerRpcUrl = _rpcUrl;

  let provider: ethers.Provider | null = null;

  try {

    if (rpcUrlProtocolType === "wss") {
      provider = new ethers.WebSocketProvider(_providerRpcUrl);
    } else if ( rpcUrlProtocolType === "https" || rpcUrlProtocolType === "http" ) { 
      provider = new ethers.JsonRpcProvider(_providerRpcUrl);
    } else {
      return { status: false, message: "Unsupported protocol type." };
    }

    if(!_byRequestSend){
      return  { status: true, message: `Provider created successful.`, provider }
    }

    // First, check if provider can detect network
    try {
      const network = await provider.getNetwork();
    } catch (error: any) {
      return { status: false, message: `Invalid network: ${error.message}` };
    }

    // Verify if provider works by fetching the block number
    try {

      const blockNumber = await provider.getBlockNumber();
      return blockNumber && Number(blockNumber) > 0
        ? { status: true, message: `Provider created. Latest Block Number: ${blockNumber}`, provider }
        : { status: false, message: "RPC Url is invalid for block request." };

    } catch (error: any) {
      return { status: false, message: `Error fetching blocknumber: ${error.message}`,};
    }

  } catch (error: any) {
    return { status: false, message: `Error creating provider: ${error.message}`,};
  }

};

// Function to create and validate a provider
const createProvider = async ( _providerRpcUrl: string, _byRequestSend: boolean = false): Promise<responseType> => {
  let checkRpcUrlProtocolResult: responseType = await checkRpcUrlProtocol(_providerRpcUrl, _byRequestSend);

  if (!checkRpcUrlProtocolResult.status) return checkRpcUrlProtocolResult;

  const rpcProtocolType_result = checkRpcUrlProtocolResult.rpcProtocolType;

  if (!rpcProtocolType_result) {
    return { status: false, message: "RPC protocol type is undefined." };
  }

  let setProviderResult: responseType = await setProvider(_providerRpcUrl,rpcProtocolType_result, _byRequestSend);

  if (setProviderResult.status) {
    return setProviderResult;
  } else {
    return { status: false, message: "Failed to create provider." };
  }

};

export { createProvider , setProvider};