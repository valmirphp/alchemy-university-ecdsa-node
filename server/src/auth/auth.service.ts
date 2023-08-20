import { randomUUID } from 'node:crypto';
import { ethers } from 'ethers';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { hashMessage } from '@core/utils';
import { TransactionEntity } from '~/auth/transaction.entity';

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
    if (!ethers.isAddress(address)) {
      throw new BadRequestException('Invalid address');
    }

    const user = this.users.get(address.toLowerCase());

    if (!user) {
      throw new NotFoundException('Nonce not found');
    }

    // validate expiry
    if (user.expiry < Date.now()) {
      throw new UnauthorizedException('Expired nonce');
    }

    return user.nonce;
  }

  generateNonce(address: string, expiryIn?: number): UserNonce {
    if (!ethers.isAddress(address)) {
      throw new BadRequestException('Invalid address');
    }

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
      throw new UnauthorizedException('Invalid nonce');
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
  ): string | null {
    const signerAddress = ethers.verifyMessage(message, signature);

    return publicKey.toLowerCase() === signerAddress.toLowerCase()
      ? signerAddress
      : null;
  }

  validateTransaction(sender: string, dto: TransactionEntity<any>): string {
    const hashDto = JSON.stringify(dto.data) + dto.nonce;
    const hash = hashMessage(hashDto);

    if (hash !== dto.hash) {
      throw new UnauthorizedException('Invalid hash');
    }

    const signerAddress = this.verifyMessage(dto.hash, dto.signature, sender);
    if (!signerAddress) {
      throw new UnauthorizedException('Invalid signature');
    }

    this.validateNonce(signerAddress, dto.nonce);

    return signerAddress;
  }

  async signTransaction<T = Record<string, any>>(
    privateKey: string,
    data: T,
  ): Promise<TransactionEntity<T>> {
    const sender = new ethers.Wallet(privateKey).address;
    const nonce = this.generateNonce(sender).nonce;
    const hash = hashMessage(JSON.stringify(data) + nonce);
    const signature = await this.signMessage(hash, privateKey);

    return new TransactionEntity<T>({
      hash,
      signature,
      data,
      nonce,
    });
  }
}
