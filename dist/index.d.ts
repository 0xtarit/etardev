import { ethers } from 'ethers';

type responseRpcUrlType$1 = {
    status: boolean;
    message: string;
    rpcProtocolType?: string;
    provider?: ethers.Provider;
};
declare const createProvider: (_providerRpcUrl: string, _checkProviderRpcUrl?: boolean) => Promise<responseRpcUrlType$1>;

type responseRpcUrlType = {
    status: boolean;
    message: string;
    rpcProtocolType?: string;
    provider?: ethers.Provider;
};
declare const checkRpcUrl: (_url: string, _blockRequest?: boolean) => Promise<responseRpcUrlType>;

declare const etardev_checkRpcUrl: typeof checkRpcUrl;
declare const etardev_createProvider: typeof createProvider;
declare namespace etardev {
  export { etardev_checkRpcUrl as checkRpcUrl, etardev_createProvider as createProvider };
}

export { checkRpcUrl, createProvider, etardev };
