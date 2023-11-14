import { PhantomProvider } from '../types';

/**
 * Signs a message
 * @param   {PhantomProvider} provider a Phantom Provider
 * @param   {String}          message  a message to sign
 * @returns {Any}                      TODO(get type)
 */

const signMessage = async (
  provider: PhantomProvider,
  address: string,
  message: string
): Promise<{ signature: Uint8Array }> => {
  try {
    const encodedMessage = new TextEncoder().encode(message);
    const result = await provider.signMessage(address, encodedMessage);
    return result;
  } catch (error) {
    console.warn(error);
    throw new Error(error.message);
  }
};

export default signMessage;
