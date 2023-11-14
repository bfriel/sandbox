/**
 * Returns a serialized PSBT from a hex string
 * @param   {String} hexString   a hex string
 * @returns {Uint8Array}       a serialized PSBT
 */

const fromHexString = (hexString: string) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

export default fromHexString;
