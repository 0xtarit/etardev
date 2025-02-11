var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/etardev.ts
var etardev_exports = {};
__export(etardev_exports, {
  checkRpcUrl: () => checkRpcUrl,
  createProvider: () => createProvider
});

// src/tools/provider/createProvider.ts
import { ethers } from "ethers";

// src/tools/provider/checkRpcUrl.ts
var checkRpcUrlProtocol = async (_rpcUrl) => {
  try {
    const protocol = new URL(_rpcUrl).protocol;
    if (!protocol) {
      return { status: false, message: "Invalid RPC Url." };
    }
    let protocolType = ["wss:", "https:", "http:"];
    if (protocolType.includes(protocol)) {
      try {
        const response = await fetch(_rpcUrl, {
          method: "POST",
          body: "{}",
          headers: { "Content-Type": "application/json" }
        });
        if (response.status === 200) {
          return { status: true, message: "RPC URL is valid and accessible.", rpcProtocolType: protocol };
        } else {
          return { status: false, message: `RPC URL responded with status: ${response.status}` };
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
var checkRpcUrl = async (_url, _blockRequest) => {
  let rpcUrl = _url;
  let protocolResult = await checkRpcUrlProtocol(rpcUrl);
  if (protocolResult.status) {
    if (_blockRequest) {
      let providerResult = await createProvider(_url, true);
      if (providerResult.status) {
        return { status: true, provider: providerResult.provider, message: providerResult.message };
      } else {
        return { status: false, message: "RPC Url is invalid for block request." };
      }
    } else {
      return { status: true, message: "RPC Url is valid." };
    }
  } else {
    return protocolResult;
  }
};

// src/tools/provider/createProvider.ts
var setProvider2 = async (_rpcUrl, _rpcUrlType) => {
  let rpcUrlProtocolType = _rpcUrlType;
  let _providerRpcUrl = _rpcUrl;
  let provider = null;
  try {
    if (rpcUrlProtocolType === "wss:") {
      provider = new ethers.WebSocketProvider(_providerRpcUrl);
    } else if (rpcUrlProtocolType === "https:" || rpcUrlProtocolType === "http:") {
      provider = new ethers.JsonRpcProvider(_providerRpcUrl);
    } else {
      return { status: false, message: "Unsupported protocol type." };
    }
    try {
      const network = await provider.getNetwork();
      console.log(`\u2705 Connected to network: ${network.name} (chainId: ${network.chainId})`);
    } catch (error) {
      return { status: false, message: `\u274C Invalid network: ${error.message}` };
    }
    try {
      const blockNumber = await provider.getBlockNumber();
      if (blockNumber && Number(blockNumber) > 0) {
        return { status: true, message: `Provider created. Latest Block Number: ${blockNumber}`, provider };
      } else {
        return { status: false, message: "RPC Url is invalid for block request." };
      }
    } catch (error) {
      return { status: false, message: `Error creating provider: ${error.message}` };
    }
  } catch (error) {
    return { status: false, message: `Error creating provider: ${error.message}` };
  }
};
var createProvider = async (_providerRpcUrl, _checkProviderRpcUrl) => {
  let checkRpcUrlProtocolResult = await checkRpcUrlProtocol(_providerRpcUrl);
  if (checkRpcUrlProtocolResult.status) {
    const rpcProtocolType_result = checkRpcUrlProtocolResult.rpcProtocolType;
    if (!rpcProtocolType_result) {
      return { status: false, message: "RPC protocol type is undefined." };
    }
    let setProviderResult = await setProvider2(_providerRpcUrl, rpcProtocolType_result);
    if (setProviderResult.status) {
      return setProviderResult;
    } else {
      return { status: false, message: "Failed to create provider." };
    }
  } else {
    return checkRpcUrlProtocolResult;
  }
};
export {
  checkRpcUrl,
  createProvider,
  etardev_exports as etardev
};
