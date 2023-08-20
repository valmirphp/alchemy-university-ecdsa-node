import { randomUUID } from 'node:crypto';
import { ethers } from 'ethers';
import { Injectable } from '@nestjs/common';

type UserNonce = {
  address: string;
  nonce: string;
  expiry: number;
};

@Injectable()
export class AuthService {
  // TODO use lru_map to store nonce in memory (safe from memory leak)
  private users = new Map<string, UserNonce>();

  getNonce(address: string): string {
    const user = this.users.get(address.toLowerCase());

    if (!user) {
      throw new Error('Nonce not found');
    }

    // validate expiry
    if (user.expiry < Date.now()) {
      throw new Error('Expired nonce');
    }

    return user.nonce;
  }

  generateNonce(address: string, expiryIn?: number): UserNonce {
    const user: UserNonce = {
      address,
      nonce: randomUUID(),
      expiry: expiryIn || Date.now() + 2 * 60 * 1000, // set expiry to 2 minutes
    };

    this.users.set(address.toLowerCase(), user);
    return user;
  }

  validateNonce(address: string, expectedNonce: string): boolean {
    const actualNonce = this.getNonce(address);

    // validate nonce
    if (actualNonce !== expectedNonce) {
      throw new Error('Invalid nonce');
    }

    this.users.delete(address.toLowerCase());
    return true;
  }

  signMessage(message: string, privateKey: string): Promise<string> {
    const wallet = new ethers.Wallet(privateKey);
    return wallet.signMessage(message);
  }

  verifyMessage(
    message: string,
    signature: string,
    publicKey: string,
  ): boolean {
    const signerAddress = ethers.verifyMessage(message, signature);
    return publicKey.toLowerCase() === signerAddress.toLowerCase();
  }
}
