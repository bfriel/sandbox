import { PhantomProvider } from '../types';

/**
 * Signs a message
 * @param   {PhantomProvider} provider a Phantom Provider
 * @param   {String}          psbtHex  a PSBT encoded as HEX
 * @returns {Any}                      TODO(get type)
 */

const signPSBT = async (provider: PhantomProvider, psbtHex: string): Promise<string> => {
  try {
    const signedPSBT = await provider.signPSBT(psbtHex, { autoFinalize: true });
    return signedPSBT;
  } catch (error) {
    console.warn(error);
    throw new Error(error.message);
  }
};

export default signPSBT;
