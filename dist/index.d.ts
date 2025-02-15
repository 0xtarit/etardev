import { ethers } from 'ethers';

type responseRpcUrlType$1 = {
    status: boolean;
    message: string;
    rpcProtocolType?: string;
    provider?: ethers.Provider;
};
declare const createProvider: (_providerRpcUrl: string) => Promise<responseRpcUrlType$1>;

type responseRpcUrlType = {
    status: boolean;
    message: string;
    rpcProtocolType?: string;
    provider?: ethers.Provider;
};
declare const checkRpcUrl: (_url: string, _blockRequest?: boolean) => Promise<responseRpcUrlType>;

declare const checkMnemonic: (_mnemonic: string) => {
    status: boolean;
    message: string;
};

declare const checkPrivatekey: (_privateKey: string) => {
    status: boolean;
    message: string;
};

type responseType = {
    status: boolean;
    message: string;
    wallets?: ethers.HDNodeWallet[] | ethers.Wallet[];
};
declare const createWallet: (_mnemonicOrPrivatekey: string, _walletCount?: number) => responseType;

declare const etardev_checkMnemonic: typeof checkMnemonic;
declare const etardev_checkPrivatekey: typeof checkPrivatekey;
declare const etardev_checkRpcUrl: typeof checkRpcUrl;
declare const etardev_createProvider: typeof createProvider;
declare const etardev_createWallet: typeof createWallet;
declare namespace etardev {
  export { etardev_checkMnemonic as checkMnemonic, etardev_checkPrivatekey as checkPrivatekey, etardev_checkRpcUrl as checkRpcUrl, etardev_createProvider as createProvider, etardev_createWallet as createWallet };
}

export { checkMnemonic, checkPrivatekey, checkRpcUrl, createProvider, createWallet, etardev };
