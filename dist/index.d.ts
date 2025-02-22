import { Provider, HDNodeWallet, Wallet } from 'ethers';

type responseType = {
    status: boolean;
    message: any;
    rpcProtocolType?: string;
    provider?: Provider;
    wallets?: HDNodeWallet[] | Wallet[];
    transactions?: Array<object>;
};

declare const createProvider: (_providerRpcUrl: string, _byRequestSend?: boolean) => Promise<responseType>;

declare const checkRpcUrl: (_url: string, validateDeep?: boolean) => Promise<responseType>;

declare const checkMnemonic: (_mnemonic: string) => responseType;

declare const checkPrivatekey: (_privateKey: string) => responseType;

declare const createWallet: (_mnemonicOrPrivatekey: string, _walletCount?: number) => responseType;

declare function decodeTxInputData(abi: any, data: string): responseType;

declare function checkABI(abi: any): responseType;

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
declare const createTx: (txDetails: TxObject[]) => responseType;

declare function isValidEtherValue(value: any): boolean;

type BigNumberish = string | number | bigint;
/**
 * Converts ETH to GWEI.
 */
declare const ethToGwei: (eth: BigNumberish) => string;
/**
 * Converts ETH to WEI.
 */
declare const ethToWei: (eth: BigNumberish) => string;
/**
 * Converts GWEI to ETH.
 */
declare const gweiToEth: (gwei: BigNumberish) => string;
/**
 * Converts GWEI to WEI.
 */
declare const gweiToWei: (gwei: BigNumberish) => string;
/**
 * Converts WEI to ETH.
 */
declare const weiToEth: (wei: BigNumberish) => string;
/**
 * Converts WEI to GWEI.
 */
declare const weiToGwei: (wei: BigNumberish) => string;

type ValidationType = "string" | "number" | "boolean" | "privateKey" | "rpcUrl" | "address";
type ValidationRule = {
    name: string;
    type: ValidationType;
};
type ValidationResult = {
    isValid: boolean;
    value: string | number | boolean | null;
    type: ValidationType;
};
type ValidationResults = Record<string, ValidationResult>;
/**
 * Validate .env variables with expected data types
 * @param {ValidationRule[]} validations - List of validations with { name, type } objects
 * @returns {Promise<ValidationResults>} Validation status and messages
 */
declare function validateEnvVariables(validations: ValidationRule[]): Promise<ValidationResults>;

declare const etardev_checkABI: typeof checkABI;
declare const etardev_checkMnemonic: typeof checkMnemonic;
declare const etardev_checkPrivatekey: typeof checkPrivatekey;
declare const etardev_checkRpcUrl: typeof checkRpcUrl;
declare const etardev_createProvider: typeof createProvider;
declare const etardev_createTx: typeof createTx;
declare const etardev_createWallet: typeof createWallet;
declare const etardev_decodeTxInputData: typeof decodeTxInputData;
declare const etardev_ethToGwei: typeof ethToGwei;
declare const etardev_ethToWei: typeof ethToWei;
declare const etardev_gweiToEth: typeof gweiToEth;
declare const etardev_gweiToWei: typeof gweiToWei;
declare const etardev_isValidEtherValue: typeof isValidEtherValue;
declare const etardev_validateEnvVariables: typeof validateEnvVariables;
declare const etardev_weiToEth: typeof weiToEth;
declare const etardev_weiToGwei: typeof weiToGwei;
declare namespace etardev {
  export { etardev_checkABI as checkABI, etardev_checkMnemonic as checkMnemonic, etardev_checkPrivatekey as checkPrivatekey, etardev_checkRpcUrl as checkRpcUrl, etardev_createProvider as createProvider, etardev_createTx as createTx, etardev_createWallet as createWallet, etardev_decodeTxInputData as decodeTxInputData, etardev_ethToGwei as ethToGwei, etardev_ethToWei as ethToWei, etardev_gweiToEth as gweiToEth, etardev_gweiToWei as gweiToWei, etardev_isValidEtherValue as isValidEtherValue, etardev_validateEnvVariables as validateEnvVariables, etardev_weiToEth as weiToEth, etardev_weiToGwei as weiToGwei };
}

export { checkABI, checkMnemonic, checkPrivatekey, checkRpcUrl, createProvider, createTx, createWallet, decodeTxInputData, etardev, ethToGwei, ethToWei, gweiToEth, gweiToWei, isValidEtherValue, validateEnvVariables, weiToEth, weiToGwei };
