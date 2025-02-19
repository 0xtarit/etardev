import { ethers } from "ethers";

type BigNumberish = string | number | bigint;

/**
 * Converts ETH to GWEI.
 */
const ethToGwei = (eth: BigNumberish): string => {
  try {
    return ethers.parseUnits(eth.toString(), "gwei").toString();
  } catch (error) {
    return "Error converting ETH to GWEI";
  }
};

/**
 * Converts ETH to WEI.
 */
const ethToWei = (eth: BigNumberish): string => {
  try {
    return ethers.parseEther(eth.toString()).toString();
  } catch (error) {
    return "Error converting ETH to WEI";
  }
};

/**
 * Converts GWEI to ETH.
 */
const gweiToEth = (gwei: BigNumberish): string => {
  try {
    return ethers.formatUnits(gwei.toString(), "gwei");
  } catch (error) {
    return "Error converting GWEI to ETH";
  }
};

/**
 * Converts GWEI to WEI.
 */
const gweiToWei = (gwei: BigNumberish): string => {
  try {
    return ethers.parseUnits(gwei.toString(), "gwei").toString();
  } catch (error) {
    return "Error converting GWEI to WEI";
  }
};

/**
 * Converts WEI to ETH.
 */
const weiToEth = (wei: BigNumberish): string => {
  try {
    return ethers.formatUnits(wei.toString(), "ether");
  } catch (error) {
    return "Error converting WEI to ETH";
  }
};

/**
 * Converts WEI to GWEI.
 */
const weiToGwei = (wei: BigNumberish): string => {
  try {
    return ethers.formatUnits(wei.toString(), "gwei");
  } catch (error) {
    return "Error converting WEI to GWEI";
  }
};

// Export all functions
export { ethToGwei, ethToWei, gweiToEth, gweiToWei, weiToEth, weiToGwei };
