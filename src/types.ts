type PhantomEvent = 'accountsChanged' | 'chainChanged';

type PhantomRequestMethod = 'requestAccounts' | 'signMessage' | 'signPSBT';

export type BtcAccount = {
  address: string;
  addressType: 'p2tr' | 'p2wpkh' | 'p2sh' | 'p2pkh';
  publicKey: string;
  purpose: 'payment' | 'ordinals';
};
export interface PhantomProvider {
  isPhantom: boolean;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  requestAccounts: () => Promise<BtcAccount[]>;
  signMessage: (address: string, message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  signPSBT(
    psbtHex: Uint8Array,
    inputsToSign: { sigHash?: number | undefined; address: string; signingIndexes: number[] }[]
  ): Promise<string>;
}

export type Status = 'success' | 'warning' | 'error' | 'info';

export interface TLog {
  status: Status;
  method?: PhantomRequestMethod | Extract<PhantomEvent, 'accountChanged'>;
  message: string;
  messageTwo?: string;
}
