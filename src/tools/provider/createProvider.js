const ethers = require('ethers');

/**
 * Create an Ethers.js provider based on the given RPC URL.
 * @param rpcUrl - The RPC URL (http, https, ws, wss).
 * @returns An Ethers.js provider.
 * @throws Error if the RPC URL is invalid.
 */
async function createProvider(rpcUrl){
  const lowercasedUrl = rpcUrl.toLowerCase();

  try {

    if (lowercasedUrl.startsWith('http') || lowercasedUrl.startsWith('https')) {
      return new ethers.JsonRpcProvider(rpcUrl);
    } else if (lowercasedUrl.startsWith('ws') || lowercasedUrl.startsWith('wss')) {
      return new ethers.WebSocketProvider(rpcUrl);
    } else {
      throw new Error('Unsupported protocol. Use http, https, ws, or wss.');
    }

  } catch (error) {

  }


}


module.exports = {createProvider}
