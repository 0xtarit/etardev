require('dotenv').config();
const ethers = require('ethers');

/**
 * Validate .env variables with expected data types
 * @param {Array} validations - List of validations with { name, type } objects
 * @returns {Object} Validation status and messages
 */

async function validateEnvVariables(validations) {

    if (!validations || !Array.isArray(validations)) {
      throw new Error('Invalid validations array: Must be a valid array.');
    }

    const result = {};

    for (const { name, type } of validations) {
      const value = process.env[name];

      if (!value) {
        result[name] = { isValid: false, value: null, type: type };
      } else {
        let validResult = await isValidType(value, type);

        result[name] = {
          isValid: validResult.isValid,
          value: validResult.value,
          type: validResult.type,
        };
      }
    }

    return result;

}

/**
 * Check if a value matches the expected data type
 * @param {string} value - The environment variable value
 * @param {string} type - The expected type (string, number, boolean, privateKey, rpcUrl)
 * @returns {boolean} Whether the value matches the type
 */
async function isValidType(_value, _type) {
  let type = _type.toLowerCase();
  let value = _value;

  // Check for primitive types
  if (type === 'number') {
    return { isValid: (typeof Number(value) === 'number' && !isNaN(value)) && typeof parseFloat(value) === 'number' , value: Number(value) , type: _type};
  } else if (type === 'string') {
    return {isValid: typeof String(value) === 'string', value: String(value), type:_type};
  } else if (type === 'boolean') {
    return {isValid: typeof Boolean(value) === 'boolean' , value: Boolean(value), type:_type};
  }

  // check others
  else if (type === 'privatekey') {
    return {isValid: await isValidPrivateKey(value), value: value, type: _type};
  }
  else if(type === 'rpcurl'){
    return { isValid: await isValidRPCUrl(value), value: value, type: _type };
  }
  else if(type === 'address'){
    return { isValid: await validateAddress(value), value: value, type: _type};
  }

  // Invalid type case
  return false;
}

// ***************** Helper functions *****************//
// ***************************************************//
// **************************************************//

// Helper: Validate Ethereum private key
async function isValidPrivateKey(key) {
  try {
    new ethers.Wallet(key);
    return true;
  } catch {
    return false;
  }
}

// Helper: Validate RPC URL format
async function isValidRPCUrl(rpcUrl) {
  const lowercasedUrl = rpcUrl.toLowerCase();

  try {

    if (lowercasedUrl.startsWith('http') || lowercasedUrl.startsWith('https')) {
      let provider = await new ethers.JsonRpcProvider(rpcUrl);
      await provider.getBlockNumber();
      return true;
    } else if (lowercasedUrl.startsWith('ws') || lowercasedUrl.startsWith('wss')) {
      let provider = await new ethers.WebSocketProvider(rpcUrl);
      await provider.getBlockNumber();
      return true;
    } else {
      throw new Error('Unsupported protocol. Use http, https, ws, or wss.');
    }

  } catch (error) {
    return false;
  }
}

async function validateAddress(address) {
  if (!address || typeof address !== 'string') {
    return false;
  }

  if (!ethers.isAddress(address)) {
   return false;
  }

  const checksumValid = ethers.getAddress(address) === address;
  if (!checksumValid && address.toLowerCase() !== address) {
    return false;
  }

  return true;
}


module.exports = {validateEnvVariables};
