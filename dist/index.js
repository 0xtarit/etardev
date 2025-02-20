var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
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
  createTx: () => createTx,
  createWallet: () => createWallet,
  decodeTxInputData: () => decodeTxInputData,
  ethToGwei: () => ethToGwei,
  ethToWei: () => ethToWei,
  gweiToEth: () => gweiToEth,
  gweiToWei: () => gweiToWei,
  isValidEtherValue: () => isValidEtherValue,
  weiToEth: () => weiToEth,
  weiToGwei: () => weiToGwei
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

// src/tools/transaction/createTx.ts
import { isAddress, isHexString as isHexString2, Interface as Interface3 } from "ethers";

// src/tools/transaction/check.ts
var { ethers: ethers6 } = __require("ethers");
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
import { ethers as ethers7 } from "ethers";
var ethToGwei = (eth) => {
  try {
    return ethers7.parseUnits(eth.toString(), "gwei").toString();
  } catch (error) {
    return "Error converting ETH to GWEI";
  }
};
var ethToWei = (eth) => {
  try {
    return ethers7.parseEther(eth.toString()).toString();
  } catch (error) {
    return "Error converting ETH to WEI";
  }
};
var gweiToEth = (gwei) => {
  try {
    return ethers7.formatUnits(gwei.toString(), "gwei");
  } catch (error) {
    return "Error converting GWEI to ETH";
  }
};
var gweiToWei = (gwei) => {
  try {
    return ethers7.parseUnits(gwei.toString(), "gwei").toString();
  } catch (error) {
    return "Error converting GWEI to WEI";
  }
};
var weiToEth = (wei) => {
  try {
    return ethers7.formatUnits(wei.toString(), "ether");
  } catch (error) {
    return "Error converting WEI to ETH";
  }
};
var weiToGwei = (wei) => {
  try {
    return ethers7.formatUnits(wei.toString(), "gwei");
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
    if (!isAddress(tx_object.to)) {
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
    } else if ("data" in tx_object && isHexString2(tx_object.data)) {
      txObject = {
        to: tx_object.to,
        data: tx_object.data
      };
      if ("value" in tx_object && isValidEtherValue(tx_object.value)) {
        txObject.value = ethToWei(tx_object.value);
      }
      addGivenParams2();
    } else if ("data" in tx_object && !isHexString2(tx_object.data)) {
      if (!checkABI(tx_object.abi).status) {
        return { status: false, message: "Invalid ABI." };
      }
      try {
        const iface = new Interface3(tx_object.abi);
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
export {
  checkABI,
  checkMnemonic,
  checkPrivatekey,
  checkRpcUrl,
  createProvider,
  createTx,
  createWallet,
  decodeTxInputData,
  etardev_exports as etardev,
  ethToGwei,
  ethToWei,
  gweiToEth,
  gweiToWei,
  isValidEtherValue,
  weiToEth,
  weiToGwei
};
