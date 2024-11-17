const { ethers } = require('ethers');

/**
 * Decodes Ethereum transaction data using the provided ABI and transaction data.
 * @param {Array} abi - The ABI of the contract.
 * @param {string} data - The transaction data in hexadecimal.
 * @returns {Object|null} The decoded data or null if no matching function found.
 */
function decodeTxInputData(abi, data) {
  if (!abi || !Array.isArray(abi)) {
    throw new Error('Invalid ABI: Must be a valid array.');
  }

  if (!data || typeof data !== 'string') {
    throw new Error('Invalid data: Must be a hexadecimal string.');
  }

  try {
    const iface = new ethers.Interface(abi);

    for (const element of abi) {
      const functionName = element.name;

      try {
        // Attempt to decode using the function's name
        const decodedData = iface.decodeFunctionData(functionName, data);

        // Retrieve function fragment to map parameter names
        const functionFragment = iface.getFunction(functionName);

        // Create a readable result
        const result = {};
        functionFragment.inputs.forEach((input, index) => {
          result[input.name] = decodedData[index].toString();
        });

        return {
          functionName,
          decodedData: result,
        };
      } catch {
        // Ignore errors for non-matching functions
      }
    }

    return {
      status: false,
      data: 'The ABI and the hex data string do not match.',
    }; // No matching function found
  } catch (error) {
    throw new Error('Invalid ABI: Must be a valid array.');
  }
}

module.exports = { decodeTxInputData };
