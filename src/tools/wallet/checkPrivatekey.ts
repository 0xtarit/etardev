import ethers, { Wallet } from "ethers";
import { responseType } from "../import/responseType";


const checkPrivatekey = (_privateKey: string): responseType => {
   try {

    new ethers.Wallet(_privateKey);
    return { status: true, message: "Valid PrivateKey" };

   } catch (error) {

    return { status: false, message: "inValid PrivateKey" };
    
   }
};

export { checkPrivatekey };