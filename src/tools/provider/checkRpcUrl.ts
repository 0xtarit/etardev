import { ethers , Provider} from "ethers";
import { createProvider } from "./createProvider";
import { responseType } from "../import/responseType";

const SUPPORTED_PROTOCOLS = new Set(["wss", "https", "http"]);

// Function to check the protocol type of an RPC URL
const checkRpcUrlProtocol = async (_rpcUrl: string): Promise<responseType> => {
  try {
    const parsedUrl = new URL(_rpcUrl);
    const protocol = parsedUrl.protocol.slice(0, -1);

    if (!protocol) {
      return { status: false, message: "Invalid RPC Url." };
    }

    if (!SUPPORTED_PROTOCOLS.has(protocol)) {
      return { status: false, message: `Unsupported protocol: ${protocol}` };
    }

    try {
      const payload = {
        method: "eth_blockNumber",
        params: [],
      };

      const response = await fetch(_rpcUrl, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5000),
      });

      if (response.status === 200) {
        return {status: true,message: "RPC URL is valid and accessible.",rpcProtocolType: protocol,};
      } else {
        return {status: false, message: `RPC URL not responded with status: ${response.status}`,};
      }
    } catch (fetchError) {
      return { status: false, message: "RPC URL is not reachable." };
    }

  } catch (error) {
    return { status: false, message: "Invalid RPC Url." };
  }

};

// Function to validate an RPC URL and check block request if needed
const checkRpcUrl = async ( _url: string, validateDeep?: boolean ): Promise<responseType> => {
  let rpcUrl: string = _url;
  let protocolResult: responseType = await checkRpcUrlProtocol(rpcUrl);

  if (!protocolResult.status) return protocolResult;

  if (validateDeep) {
    const providerResult = await createProvider(_url);

    if (!providerResult.status) {
      return { status: false, message: `RPC failed deep validation: ${providerResult.message}`, };
    }

    return providerResult;

  } else {
    return protocolResult;
  }

};

export { checkRpcUrlProtocol, checkRpcUrl };
