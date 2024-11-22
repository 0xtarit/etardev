const { ethers } = require('ethers');
const convert = require('../read/convert');
const { validateAddress } = require('../read/validateAddress')

function createContractTx(txDetails) {
  // Define required parameters and utility functions
  const REQUIRED_PARAMETERS = [
    "to", "data", "abi", "gasPrice", "gasLimit",
    "maxPriorityFeePerGas", "maxFeePerGas", "from",
    "value", "nonce", "chainId"
  ];

  if (!txDetails || typeof txDetails !== 'object') {
    return { isValid: false, message: "Transaction details are missing or invalid." };
  }

  // Utility to validate if a parameter exists
  const checkParameter = (paramName) => txDetails?.[paramName] !== undefined;

  // Utility to validate hex strings
  const isHex = (value) => ethers.isHexString(value);

  // Validate ABI
  const validateAbi = (abi) => {
    try {
      new ethers.Interface(abi);
      return true;
    } catch {
      return false;
    }
  };

  // Encode function call
  const encodeFunctionCall = (functionName, abi, params) => {
    try {
      const contractInterface = new ethers.Interface(abi);
      return contractInterface.encodeFunctionData(functionName, params);
    } catch (error) {
      throw new Error('Invalid ABI, function name, or parameters.');
    }
  };

  // Ensure mandatory fields are present
  for (const param of ["to", "data"]) {
    if (!checkParameter(param)) {
      return { isValid: false, message: `Missing transaction parameter: ${param}` };
    }
  }

  // check to and from address
  for (const param of ["to"]) {
    try {

      if (!validateAddress(txDetails[param])?.isValid ) {
        return { isValid: false, message: `Invalid input: Please provide a valid '${param}' address.` };
      }

    } catch (error) {
      return { isValid: false, message: `Error validating '${param}' address: ${error.message}` };
    }
  }

  if (checkParameter(txDetails.from)) {
      try {
        if (!validateAddress(txDetails[param])?.isValid) {
          return {
            isValid: false,
            message: `Invalid input: Please provide a valid 'from' address.`,
          };
        }
      } catch (error) {
        return {
          isValid: false,
          message: `Error validating 'from' address: ${error.message}`,
        };
      }
  }

  // Handle "data" and ABI encoding
  if (!isHex(txDetails.data)) {
    if (!checkParameter("abi")) {
      return { isValid: false, message: "Missing ABI for function encoding" };
    }

    if (!(validateAbi(txDetails.abi))) {
      return { isValid: false, message: "Invalid ABI format" };
    }

    try {
      txDetails.data = encodeFunctionCall(
        txDetails.data.function,
        txDetails.abi,
        txDetails.data.parameters
      );
    } catch (error) {
      return { isValid: false, message: error.message };
    }
  }

  // Build the transaction object
  const txObject = {
    to: txDetails.to,
    data: txDetails.data,
    ...(checkParameter("from") && { from: txDetails.from }),
    ...(checkParameter("value") && { value: convert.ethToWei(txDetails.value.toString()) }),
    ...(checkParameter("gasLimit") && { gasLimit: Number(txDetails.gasLimit) }),
    ...(checkParameter("nonce") && { nonce: txDetails.nonce }),
    ...(checkParameter("chainId") && { chainId: txDetails.chainId }),
  };

  if (checkParameter("gasPrice")) {
    txObject.gasPrice = convert.gweiToWei(txDetails.gasPrice.toString());
  } else if (checkParameter("maxPriorityFeePerGas") && checkParameter("maxFeePerGas")) {
    txObject.maxPriorityFeePerGas = convert.gweiToWei(txDetails.maxPriorityFeePerGas.toString());
    txObject.maxFeePerGas = convert.gweiToWei(txDetails.maxFeePerGas.toString());
  }

  return txObject;
}

module.exports = { createContractTx };
