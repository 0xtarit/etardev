import { Provider, HDNodeWallet, Wallet } from 'ethers';

type responseType = {
    status: boolean;
    message: any;
    rpcProtocolType?: string;
    provider?: Provider;
    wallets?: HDNodeWallet[] | Wallet[];
};

declare const createProvider: (_providerRpcUrl: string) => Promise<responseType>;

declare const checkRpcUrl: (_url: string, validateDeep?: boolean) => Promise<responseType>;

declare const checkMnemonic: (_mnemonic: string) => responseType;

declare const checkPrivatekey: (_privateKey: string) => responseType;

declare const createWallet: (_mnemonicOrPrivatekey: string, _walletCount?: number) => responseType;

declare function decodeTxInputData(abi: any, data: string): responseType;

declare function checkABI(abi: any): responseType;

declare const etardev_checkABI: typeof checkABI;
declare const etardev_checkMnemonic: typeof checkMnemonic;
declare const etardev_checkPrivatekey: typeof checkPrivatekey;
declare const etardev_checkRpcUrl: typeof checkRpcUrl;
declare const etardev_createProvider: typeof createProvider;
declare const etardev_createWallet: typeof createWallet;
declare const etardev_decodeTxInputData: typeof decodeTxInputData;
declare namespace etardev {
  export { etardev_checkABI as checkABI, etardev_checkMnemonic as checkMnemonic, etardev_checkPrivatekey as checkPrivatekey, etardev_checkRpcUrl as checkRpcUrl, etardev_createProvider as createProvider, etardev_createWallet as createWallet, etardev_decodeTxInputData as decodeTxInputData };
}

export { checkABI, checkMnemonic, checkPrivatekey, checkRpcUrl, createProvider, createWallet, decodeTxInputData, etardev };
