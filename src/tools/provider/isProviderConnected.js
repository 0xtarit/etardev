const ethers = require('ethers');

/**
 * Check if the provider is connected by calling `getBlockNumber`.
 * @param provider - An Ethers.js provider instance.
 * @returns `true` if connected, otherwise `false`.
 */
async function isProviderConnected(provider) {
  try {

    if (provider && typeof provider.getBlockNumber === 'function') {
      const network = await provider.getNetwork();
      return { status : true , chainId: network.chainId };
    } else {
      throw new Error('The provided object is not a valid provider.');
    }

  } catch (error) {
    throw new Error('Connection check failed');
    return false;
  }
}

module.exports = { isProviderConnected };
