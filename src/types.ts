type PhantomEvent = 'accountsChanged' | 'chainChanged';

type PhantomRequestMethod = 'requestAccounts' | 'signMessage' | 'signPSBT';

export type BtcAccount = {
  address: string;
  publicKey: string;
};
export interface PhantomProvider {
  isPhantom: boolean;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  requestAccounts: () => Promise<BtcAccount[]>;
  signMessage: (message: Uint8Array) => Promise<{ signedMessage: Uint8Array; signature: Uint8Array }>;
  signPSBT(
    psbtHex: string,
    options: {
      autoFinalize: boolean;
    }
  ): Promise<string>;
}

export type Status = 'success' | 'warning' | 'error' | 'info';

export interface TLog {
  status: Status;
  method?: PhantomRequestMethod | Extract<PhantomEvent, 'accountChanged'>;
  message: string;
  messageTwo?: string;
}
