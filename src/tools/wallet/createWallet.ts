import { ethers, Mnemonic, Wallet, HDNodeWallet } from "ethers";
import { checkMnemonic } from "./checkMnemonic";
import { checkPrivatekey } from "./checkPrivatekey";
import { responseType } from "../import/responseType";

const createWallet = (_mnemonicOrPrivatekey: string, _walletCount: number = 1): responseType => {

  try {

    if (checkMnemonic(_mnemonicOrPrivatekey).status) {

      const wallets: HDNodeWallet[] = [];

      if (_walletCount < 1 || !Number.isInteger(_walletCount)) {
        _walletCount = 1;
      }

      for (let i = 0; i < _walletCount; i++) {
        const hdWallet = HDNodeWallet.fromMnemonic(Mnemonic.fromPhrase(_mnemonicOrPrivatekey),`m/44'/60'/0'/0/${i}`);
        wallets.push(hdWallet);
      }

      return { status: true, message:`Wallet(s) created successfully from mnemonic.`, wallets};

    } else if (checkPrivatekey(_mnemonicOrPrivatekey).status) {

      const wallets: Wallet[] = [new Wallet(_mnemonicOrPrivatekey),];
      return {status: true,message: `Wallet created successfully from private key.`, wallets};

    } else {

      return {status: false, message: `Invalid mnemonic or private key provided.`};

    }

  } catch (error: any) {
    return { status: false, message: `Error: ${error.message}` };
  }

};

export {createWallet};

