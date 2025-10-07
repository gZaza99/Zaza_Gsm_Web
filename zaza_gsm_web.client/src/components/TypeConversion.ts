/**
 * Converts a hexadecimal string to a BigInt.
 * @param hexString - The hexadecimal string to convert (e.g., "0x1a").
 * @returns The corresponding BigInt value.
 */
export default function hexToBigInt(hexString: string): bigint {
  if (!/^0x[0-9a-fA-F]+$/.test(hexString)) {
    throw new Error("Invalid hexadecimal string format. Must start with '0x'.");
  }

  return BigInt(hexString);
}