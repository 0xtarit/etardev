import { Interface } from "ethers";
import { responseType } from "../import/responseType";

function checkABI(abi: any): responseType {

  try {
    if (!Array.isArray(abi) || abi.length === 0) {
      return { status: false, message: "Invalid ABI: Must be a valid array" };
    }

    new Interface(abi);
    return {status: true, message: "Valid ABI."};

  } catch (error) {
    return {status: false, message: "Invalid ABI"};
  }

}

export {checkABI};