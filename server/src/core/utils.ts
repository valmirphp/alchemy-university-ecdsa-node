import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';

export const hashMessage = (message: string): string => {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);

  return toHex(hash);
};
