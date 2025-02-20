import { Provider , HDNodeWallet, Wallet} from "ethers";

export type responseType = {
  status: boolean;
  message: any;
  rpcProtocolType?: string;
  provider?: Provider;
  wallets?: HDNodeWallet[] | Wallet[];
  transactions?: Array<object>;
};