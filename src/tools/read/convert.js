const { ethers } = require('ethers');

const convertEthUnits = {
  ethToGwei: (eth) => ethers.parseUnits(eth.toString(), 'gwei'),
  ethToWei: (eth) => ethers.parseEther(eth.toString()),
  gweiToEth: (gwei) => ethers.formatUnits(gwei.toString(), 'gwei'),
  gweiToWei: (gwei) => ethers.parseUnits(gwei.toString(), 'gwei'),
  weiToEth: (wei) => ethers.formatUnits(wei.toString(), 'ether'),
  weiToGwei: (wei) => ethers.formatUnits(wei.toString(), 'gwei'),
};


function ethToGwei(_ethToGwei){
   try {
     return convertEthUnits.ethToGwei(_ethToGwei);
   } catch (error) {
     return `Error converting ETH to GWEI`;
   }
}

function ethToWei(_ethToWei){
    try {
      return convertEthUnits.ethToWei(_ethToWei);
    } catch (error) {
      console.log(error)
      return `Error converting ETH to WEI`;
    }
}

function gweiToEth(_gweiToEth){
  try {
    return convertEthUnits.gweiToEth(_gweiToEth);
  } catch (error) {
    return `Error converting WEI to ETH`;
  }
}

function gweiToWei(_gweiToWei) {
  try {
    return convertEthUnits.gweiToWei(_gweiToWei);
  } catch (error) {
    return `Error converting GWEI to WEI`;
  }
}

function weiToEth(_weiToEth) {
  try {
    return convertEthUnits.weiToEth(_weiToEth);
  } catch (error) {
    return `Error converting WEI to ETH`;
  }
}

function weiToGwei(_weiToGwei) {
  try {
    return convertEthUnits.weiToGwei(_weiToGwei);
  } catch (error) {
    return `Error converting WEI to GWEI`;
  }
}

module.exports = {ethToGwei,ethToWei,gweiToEth,gweiToWei,weiToEth,weiToGwei};