import ethers, { isAddress, isHexString , Interface} from "ethers";
import { responseType } from "../import/responseType";
import { isValidEtherValue } from "./check";
import { ethToGwei, ethToWei, gweiToEth, gweiToWei, weiToEth, weiToGwei } from "../convert/ethConvert";
import { checkABI } from "./checkAbi";

interface data {
  function: string;
  parameters: Array<any>;
}

interface TxObject {
  to: string;
  data?: string | data;
  value?: string;
  gasLimit?: number;
  gasPrice?: string;
  nonce?: number;
  chainId?: number;
  from?: string;

  abi?: Array<object>;

  v?: number;
  r?: string;
  s?: string;

  maxPriorityFeePerGas?: number;
  maxFeePerGas?: number;
  accessList?: Array<object>;
  type?: number;
}

const allowedParams = ["gasLimit","gasPrice","nonce","chainId","from","v","r","s","maxPriorityFeePerGas","maxFeePerGas","accessList","type",];

const createTx = (txDetails: TxObject[] ): responseType => {

  let createdTxObject: Array<Partial<TxObject>> = [];

  if (!Array.isArray(txDetails)) return { status: false, message: "Invalid transaction details." };

  for (const tx_object of txDetails) {

    let txObject: Partial<TxObject> = {};

    if (!("to" in tx_object)) {
        return { status: false, message: "Transaction recipient is required." };
    }

    if (!isAddress(tx_object.to)) {
      return { status: false, message: `Invalid Ethereum address "to".` };
    }

    if (!("data" in tx_object || "value" in tx_object)) {
      return { status: false, message: "Transaction must include either 'data' or 'value'." };
    }

    // optional parameters added to txObject
    function addGivenParams() {
      allowedParams.forEach((param) => {
        if (param in tx_object) {
          if (["gasPrice", "maxPriorityFeePerGas", "maxFeePerGas"].includes(param)) {
            (txObject as any)[param] = gweiToWei((tx_object as any)[param]);
          } else {
            (txObject as any)[param] = (tx_object as any)[param];
          }
        }
      });
    }

    // *********************  create only ether sending transaction *********************

    if ("value" in tx_object && isValidEtherValue(tx_object.value) && !("data" in tx_object)) {

      txObject = {
        to: tx_object.to,
        value: ethToWei(tx_object.value as string),
      };

      addGivenParams();

    }

    // *********************  create only data sending transaction *********************
    else if ("data" in tx_object && isHexString(tx_object.data)) {

      txObject = {
        to: tx_object.to,
        data: tx_object.data,
      }

      if("value" in tx_object && isValidEtherValue(tx_object.value)){
        txObject.value = ethToWei(tx_object.value as string);
      }

      addGivenParams();

    }

    // *********************  create ether and data sending transaction *********************
    else if ("data" in tx_object && !isHexString(tx_object.data)) {

      if(!checkABI(tx_object.abi).status) {
        return { status: false, message: "Invalid ABI." };
      }

      try {

        const iface = new Interface(tx_object.abi as Array<object>);
        const encodedData = iface.encodeFunctionData((tx_object.data as data).function, (tx_object.data as data).parameters);

        txObject = {
          to: tx_object.to,
          data: encodedData,
        };

        if("value" in tx_object && isValidEtherValue(tx_object.value)) {
          txObject.value = ethToWei(tx_object.value as string);
        }

        addGivenParams();

      } catch (error) {
        return {status: false, message: `Please provide valid abi and data. ${error}`};
      }

    } 

    // invalid transaction details
    else {
      return { status: false, message: "Invalid transaction details." };
    }

    createdTxObject.push(txObject);

  };

  return { status: true, message: "Transaction created successfully.", transactions: createdTxObject };

}

export {createTx};
