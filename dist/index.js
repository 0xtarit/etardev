var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/etardev.ts
var etardev_exports = {};
__export(etardev_exports, {
  checkABI: () => checkABI,
  checkMnemonic: () => checkMnemonic,
  checkPrivatekey: () => checkPrivatekey,
  checkRpcUrl: () => checkRpcUrl,
  createProvider: () => createProvider,
  createWallet: () => createWallet,
  decodeTxInputData: () => decodeTxInputData
});

// src/tools/provider/createProvider.ts
import { ethers } from "ethers";

// src/tools/provider/checkRpcUrl.ts
var SUPPORTED_PROTOCOLS = /* @__PURE__ */ new Set(["wss", "https", "http"]);
var checkRpcUrlProtocol = async (_rpcUrl) => {
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
        params: []
      };
      const response = await fetch(_rpcUrl, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5e3)
      });
      if (response.status === 200) {
        return { status: true, message: "RPC URL is valid and accessible.", rpcProtocolType: protocol };
      } else {
        return { status: false, message: `RPC URL not responded with status: ${response.status}` };
      }
    } catch (fetchError) {
      return { status: false, message: "RPC URL is not reachable." };
    }
  } catch (error) {
    return { status: false, message: "Invalid RPC Url." };
  }
};
var checkRpcUrl = async (_url, validateDeep) => {
  let rpcUrl = _url;
  let protocolResult = await checkRpcUrlProtocol(rpcUrl);
  if (!protocolResult.status) return protocolResult;
  if (validateDeep) {
    const providerResult = await createProvider(_url);
    if (!providerResult.status) {
      return { status: false, message: `RPC failed deep validation: ${providerResult.message}` };
    }
    return providerResult;
  } else {
    return protocolResult;
  }
};

// src/tools/provider/createProvider.ts
var setProvider = async (_rpcUrl, _rpcUrlType) => {
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
      console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`);
    } catch (error) {
      return { status: false, message: `Invalid network: ${error.message}` };
    }
    try {
      const blockNumber = await provider.getBlockNumber();
      return blockNumber && Number(blockNumber) > 0 ? { status: true, message: `Provider created. Latest Block Number: ${blockNumber}`, provider } : { status: false, message: "RPC Url is invalid for block request." };
    } catch (error) {
      return { status: false, message: `Error fetching blocknumber: ${error.message}` };
    }
  } catch (error) {
    return { status: false, message: `Error creating provider: ${error.message}` };
  }
};
var createProvider = async (_providerRpcUrl) => {
  let checkRpcUrlProtocolResult = await checkRpcUrlProtocol(_providerRpcUrl);
  if (!checkRpcUrlProtocolResult.status) return checkRpcUrlProtocolResult;
  const rpcProtocolType_result = checkRpcUrlProtocolResult.rpcProtocolType;
  if (!rpcProtocolType_result) {
    return { status: false, message: "RPC protocol type is undefined." };
  }
  let setProviderResult = await setProvider(_providerRpcUrl, rpcProtocolType_result);
  if (setProviderResult.status) {
    return setProviderResult;
  } else {
    return { status: false, message: "Failed to create provider." };
  }
};

// src/tools/wallet/checkMnemonic.ts
import { Mnemonic } from "ethers";
var checkMnemonic = (_mnemonic) => {
  try {
    const isValid = Mnemonic.isValidMnemonic(_mnemonic);
    return {
      status: isValid,
      message: isValid ? "Valid Mnemonic" : "Invalid Mnemonic"
    };
  } catch (error) {
    return { status: false, message: "inValid Mnemonic" };
  }
};

// src/tools/wallet/checkPrivatekey.ts
import ethers3 from "ethers";
var checkPrivatekey = (_privateKey) => {
  try {
    new ethers3.Wallet(_privateKey);
    return { status: true, message: "Valid PrivateKey" };
  } catch (error) {
    return { status: false, message: "inValid PrivateKey" };
  }
};

// src/tools/wallet/createWallet.ts
import { Mnemonic as Mnemonic2, Wallet as Wallet2, HDNodeWallet } from "ethers";
var createWallet = (_mnemonicOrPrivatekey, _walletCount = 1) => {
  try {
    if (checkMnemonic(_mnemonicOrPrivatekey).status) {
      const wallets = [];
      if (_walletCount < 1 || !Number.isInteger(_walletCount)) {
        _walletCount = 1;
      }
      for (let i = 0; i < _walletCount; i++) {
        const hdWallet = HDNodeWallet.fromMnemonic(Mnemonic2.fromPhrase(_mnemonicOrPrivatekey), `m/44'/60'/0'/0/${i}`);
        wallets.push(hdWallet);
      }
      return { status: true, message: `Wallet(s) created successfully from mnemonic.`, wallets };
    } else if (checkPrivatekey(_mnemonicOrPrivatekey).status) {
      const wallets = [new Wallet2(_mnemonicOrPrivatekey)];
      return { status: true, message: `Wallet created successfully from private key.`, wallets };
    } else {
      return { status: false, message: `Invalid mnemonic or private key provided.` };
    }
  } catch (error) {
    return { status: false, message: `Error: ${error.message}` };
  }
};

// src/tools/transaction/decodeTxInputData.ts
import { ethers as ethers5, Interface as Interface2, isHexString } from "ethers";

// src/tools/transaction/checkAbi.ts
import { Interface } from "ethers";
function checkABI(abi) {
  try {
    if (!Array.isArray(abi) || abi.length === 0) {
      return { status: false, message: "Invalid ABI: Must be a valid array" };
    }
    new Interface(abi);
    return { status: true, message: "Valid ABI." };
  } catch (error) {
    return { status: false, message: "Invalid ABI" };
  }
}

// src/tools/transaction/decodeTxInputData.ts
function decodeTxInputData(abi, data) {
  let abivalidate = checkABI(abi);
  if (!abivalidate.status) {
    return abivalidate;
  }
  if (!data || typeof data !== "string" || !isHexString(data)) {
    return { status: false, message: `Invalid data: Must be a hexadecimal string` };
  }
  try {
    const iface = new Interface2(abi);
    const parsedTx = iface.parseTransaction({ data });
    if (!parsedTx) {
      return { status: false, message: "No matching function found in ABI" };
    }
    const { fragment, args } = parsedTx;
    const decodedData = [];
    fragment.inputs.forEach((input, index) => {
      decodedData.push({
        Name: input.name,
        Type: input.type,
        Data: formatValue(input, args[index])
      });
    });
    return { status: true, message: { functionName: fragment.name, signature: fragment.format(), data: decodedData } };
  } catch (error) {
    return { status: false, message: "Unknown error occurred during decoding" };
  }
}
function formatValue(param, value) {
  if (param.type === "address") {
    return ethers5.getAddress(value.toLowerCase());
  }
  if (param.type.startsWith("uint") || param.type.startsWith("int")) {
    return value.toString();
  }
  if (param.type === "tuple" && param.components) {
    return param.components.reduce(
      (acc, component, index) => {
        acc[component.name] = formatValue(component, value[index]);
        return acc;
      },
      {}
    );
  }
  return value;
}
export {
  checkABI,
  checkMnemonic,
  checkPrivatekey,
  checkRpcUrl,
  createProvider,
  createWallet,
  decodeTxInputData,
  etardev_exports as etardev
};
