import { PhantomProvider } from '../types';
import fromHexString from './fromHexString';

/**
 * Signs a message
 * @param   {PhantomProvider} provider a Phantom Provider
 * @param   {String}          psbtHex  a PSBT encoded as HEX
 * @returns {String}                   a signed PSBT
 */

const signPSBT = async (provider: PhantomProvider, psbtHex: string, address: string): Promise<string> => {
  try {
    const signedPSBT = await provider.signPSBT(fromHexString(psbtHex), [
      {
        address,
        signingIndexes: [0, 1, 3],
        sigHash: 0,
      },
    ]);
    return signedPSBT;
  } catch (error) {
    console.warn(error);
    throw new Error(error.message);
  }
};

export default signPSBT;
