"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var index_exports = {};
__export(index_exports, {
  checkABI: () => checkABI,
  checkMnemonic: () => checkMnemonic,
  checkPrivatekey: () => checkPrivatekey,
  checkRpcUrl: () => checkRpcUrl,
  createProvider: () => createProvider,
  createTx: () => createTx,
  createWallet: () => createWallet,
  decodeTxInputData: () => decodeTxInputData,
  etardev: () => etardev_exports,
  ethToGwei: () => ethToGwei,
  ethToWei: () => ethToWei,
  gweiToEth: () => gweiToEth,
  gweiToWei: () => gweiToWei,
  isValidEtherValue: () => isValidEtherValue,
  validateEnvVariables: () => validateEnvVariables,
  weiToEth: () => weiToEth,
  weiToGwei: () => weiToGwei
});
module.exports = __toCommonJS(index_exports);

// src/etardev.ts
var etardev_exports = {};
__export(etardev_exports, {
  checkABI: () => checkABI,
  checkMnemonic: () => checkMnemonic,
  checkPrivatekey: () => checkPrivatekey,
  checkRpcUrl: () => checkRpcUrl,
  createProvider: () => createProvider,
  createTx: () => createTx,
  createWallet: () => createWallet,
  decodeTxInputData: () => decodeTxInputData,
  ethToGwei: () => ethToGwei,
  ethToWei: () => ethToWei,
  gweiToEth: () => gweiToEth,
  gweiToWei: () => gweiToWei,
  isValidEtherValue: () => isValidEtherValue,
  validateEnvVariables: () => validateEnvVariables,
  weiToEth: () => weiToEth,
  weiToGwei: () => weiToGwei
});

// src/tools/provider/createProvider.ts
var import_ethers = require("ethers");

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
    if (rpcUrlProtocolType === "wss") {
      provider = new import_ethers.ethers.WebSocketProvider(_providerRpcUrl);
    } else if (rpcUrlProtocolType === "https" || rpcUrlProtocolType === "http") {
      provider = new import_ethers.ethers.JsonRpcProvider(_providerRpcUrl);
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
var import_ethers2 = require("ethers");
var checkMnemonic = (_mnemonic) => {
  try {
    const isValid = import_ethers2.Mnemonic.isValidMnemonic(_mnemonic);
    return {
      status: isValid,
      message: isValid ? "Valid Mnemonic" : "Invalid Mnemonic"
    };
  } catch (error) {
    return { status: false, message: "inValid Mnemonic" };
  }
};

// src/tools/wallet/checkPrivatekey.ts
var import_ethers3 = __toESM(require("ethers"), 1);
var checkPrivatekey = (_privateKey) => {
  try {
    new import_ethers3.default.Wallet(_privateKey);
    return { status: true, message: "Valid PrivateKey" };
  } catch (error) {
    return { status: false, message: "inValid PrivateKey" };
  }
};

// src/tools/wallet/createWallet.ts
var import_ethers4 = require("ethers");
var createWallet = (_mnemonicOrPrivatekey, _walletCount = 1) => {
  try {
    if (checkMnemonic(_mnemonicOrPrivatekey).status) {
      const wallets = [];
      if (_walletCount < 1 || !Number.isInteger(_walletCount)) {
        _walletCount = 1;
      }
      for (let i = 0; i < _walletCount; i++) {
        const hdWallet = import_ethers4.HDNodeWallet.fromMnemonic(import_ethers4.Mnemonic.fromPhrase(_mnemonicOrPrivatekey), `m/44'/60'/0'/0/${i}`);
        wallets.push(hdWallet);
      }
      return { status: true, message: `Wallet(s) created successfully from mnemonic.`, wallets };
    } else if (checkPrivatekey(_mnemonicOrPrivatekey).status) {
      const wallets = [new import_ethers4.Wallet(_mnemonicOrPrivatekey)];
      return { status: true, message: `Wallet created successfully from private key.`, wallets };
    } else {
      return { status: false, message: `Invalid mnemonic or private key provided.` };
    }
  } catch (error) {
    return { status: false, message: `Error: ${error.message}` };
  }
};

// src/tools/transaction/decodeTxInputData.ts
var import_ethers6 = require("ethers");

// src/tools/transaction/checkAbi.ts
var import_ethers5 = require("ethers");
function checkABI(abi) {
  try {
    if (!Array.isArray(abi) || abi.length === 0) {
      return { status: false, message: "Invalid ABI: Must be a valid array" };
    }
    new import_ethers5.Interface(abi);
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
  if (!data || typeof data !== "string" || !(0, import_ethers6.isHexString)(data)) {
    return { status: false, message: `Invalid data: Must be a hexadecimal string` };
  }
  try {
    const iface = new import_ethers6.Interface(abi);
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
        Value: formatValue(input, args[index])
      });
    });
    return { status: true, message: { functionName: fragment.name, signature: fragment.format(), data: decodedData } };
  } catch (error) {
    return { status: false, message: "Unknown error occurred during decoding" };
  }
}
function formatValue(param, value) {
  if (param.type === "address") {
    return import_ethers6.ethers.getAddress(value.toLowerCase());
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

// src/tools/transaction/createTx.ts
var import_ethers8 = require("ethers");

// src/tools/transaction/check.ts
var { ethers: ethers6 } = require("ethers");
function isValidEtherValue(value) {
  try {
    const ethValue = ethers6.parseEther(value.toString());
    if (ethValue > 0n) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

// src/tools/convert/ethConvert.ts
var import_ethers7 = require("ethers");
var ethToGwei = (eth) => {
  try {
    return import_ethers7.ethers.parseUnits(eth.toString(), "gwei").toString();
  } catch (error) {
    return "Error converting ETH to GWEI";
  }
};
var ethToWei = (eth) => {
  try {
    return import_ethers7.ethers.parseEther(eth.toString()).toString();
  } catch (error) {
    return "Error converting ETH to WEI";
  }
};
var gweiToEth = (gwei) => {
  try {
    return import_ethers7.ethers.formatUnits(gwei.toString(), "gwei");
  } catch (error) {
    return "Error converting GWEI to ETH";
  }
};
var gweiToWei = (gwei) => {
  try {
    return import_ethers7.ethers.parseUnits(gwei.toString(), "gwei").toString();
  } catch (error) {
    return "Error converting GWEI to WEI";
  }
};
var weiToEth = (wei) => {
  try {
    return import_ethers7.ethers.formatUnits(wei.toString(), "ether");
  } catch (error) {
    return "Error converting WEI to ETH";
  }
};
var weiToGwei = (wei) => {
  try {
    return import_ethers7.ethers.formatUnits(wei.toString(), "gwei");
  } catch (error) {
    return "Error converting WEI to GWEI";
  }
};

// src/tools/transaction/createTx.ts
var allowedParams = ["gasLimit", "gasPrice", "nonce", "chainId", "from", "v", "r", "s", "maxPriorityFeePerGas", "maxFeePerGas", "accessList", "type"];
var createTx = (txDetails) => {
  let createdTxObject = [];
  if (!Array.isArray(txDetails)) return { status: false, message: "Invalid transaction details." };
  for (const tx_object of txDetails) {
    let addGivenParams2 = function() {
      allowedParams.forEach((param) => {
        if (param in tx_object) {
          if (["gasPrice", "maxPriorityFeePerGas", "maxFeePerGas"].includes(param)) {
            txObject[param] = gweiToWei(tx_object[param]);
          } else {
            txObject[param] = tx_object[param];
          }
        }
      });
    };
    var addGivenParams = addGivenParams2;
    let txObject = {};
    if (!("to" in tx_object)) {
      return { status: false, message: "Transaction recipient is required." };
    }
    if (!(0, import_ethers8.isAddress)(tx_object.to)) {
      return { status: false, message: `Invalid Ethereum address "to".` };
    }
    if (!("data" in tx_object || "value" in tx_object)) {
      return { status: false, message: "Transaction must include either 'data' or 'value'." };
    }
    if ("value" in tx_object && isValidEtherValue(tx_object.value) && !("data" in tx_object)) {
      txObject = {
        to: tx_object.to,
        value: ethToWei(tx_object.value)
      };
      addGivenParams2();
    } else if ("data" in tx_object && (0, import_ethers8.isHexString)(tx_object.data)) {
      txObject = {
        to: tx_object.to,
        data: tx_object.data
      };
      if ("value" in tx_object && isValidEtherValue(tx_object.value)) {
        txObject.value = ethToWei(tx_object.value);
      }
      addGivenParams2();
    } else if ("data" in tx_object && !(0, import_ethers8.isHexString)(tx_object.data)) {
      if (!checkABI(tx_object.abi).status) {
        return { status: false, message: "Invalid ABI." };
      }
      try {
        const iface = new import_ethers8.Interface(tx_object.abi);
        const encodedData = iface.encodeFunctionData(tx_object.data.function, tx_object.data.parameters);
        txObject = {
          to: tx_object.to,
          data: encodedData
        };
        if ("value" in tx_object && isValidEtherValue(tx_object.value)) {
          txObject.value = ethToWei(tx_object.value);
        }
        addGivenParams2();
      } catch (error) {
        return { status: false, message: `Please provide valid abi and data. ${error}` };
      }
    } else {
      return { status: false, message: "Invalid transaction details." };
    }
    createdTxObject.push(txObject);
  }
  ;
  return { status: true, message: "Transaction created successfully.", transactions: createdTxObject };
};

// src/tools/convert/validateEnvVariables.ts
var import_dotenv = require("dotenv");
var import_ethers9 = require("ethers");
(0, import_dotenv.config)();
async function validateEnvVariables(validations) {
  if (!Array.isArray(validations)) {
    throw new Error("Invalid validations array: Must be a valid array.");
  }
  const result = {};
  for (const { name, type } of validations) {
    const value = process.env[name] || null;
    result[name] = await validateValue(value, type);
  }
  return result;
}
async function validateValue(value, type) {
  if (!value) {
    return { isValid: false, value: null, type };
  }
  switch (type) {
    case "number":
      return { isValid: !isNaN(Number(value)), value: Number(value), type };
    case "string":
      return { isValid: typeof value === "string", value, type };
    case "boolean":
      return { isValid: value.toLowerCase() === "true" || value.toLowerCase() === "false", value: value.toLowerCase() === "true", type };
    case "privateKey":
      return { isValid: checkPrivatekey(value).status, value, type };
    case "rpcUrl":
      const rpcUrlCheckResult = await checkRpcUrl(value);
      return { isValid: rpcUrlCheckResult.status, value, type };
    case "address":
      return { isValid: (0, import_ethers9.isAddress)(value), value, type };
    default:
      return { isValid: false, value, type };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkABI,
  checkMnemonic,
  checkPrivatekey,
  checkRpcUrl,
  createProvider,
  createTx,
  createWallet,
  decodeTxInputData,
  etardev,
  ethToGwei,
  ethToWei,
  gweiToEth,
  gweiToWei,
  isValidEtherValue,
  validateEnvVariables,
  weiToEth,
  weiToGwei
});
