const { createProvider, isProviderConnected } = require('./tools/provider/provider');
const { decodeTxInputData } = require('./tools/decode/decode');
const {
  validateAddress,
  validateEnvVariables,
  ethToGwei,
  ethToWei,
  gweiToEth,
  gweiToWei,
  weiToEth,
  weiToGwei
} = require('./tools/read/read');

const { createContractTx } = require('./tools/tx/tx');

module.exports = {
  createProvider,
  isProviderConnected,
  decodeTxInputData,
  validateAddress,
  validateEnvVariables,
  ethToGwei,
  ethToWei,
  gweiToEth,
  gweiToWei,
  weiToEth,
  weiToGwei,
  createContractTx,
};