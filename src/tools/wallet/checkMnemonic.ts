import ethers, { Mnemonic } from "ethers";
import { responseType } from "../import/responseType";

const checkMnemonic = (_mnemonic: string): responseType => {
   try {
    const isValid = Mnemonic.isValidMnemonic(_mnemonic);
    return {
      status: isValid,
      message: isValid ? "Valid Mnemonic" : "Invalid Mnemonic",
    };
   } catch (error) {
    return { status: false, message: "inValid Mnemonic" };
   }
};

export { checkMnemonic };