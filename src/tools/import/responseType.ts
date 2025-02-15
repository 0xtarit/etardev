import { Provider , HDNodeWallet, Wallet} from "ethers";

export type responseType = {
  status: boolean;
  message: string;
  rpcProtocolType?: string;
  provider?: Provider;
  wallets?: HDNodeWallet[] | Wallet[];
};