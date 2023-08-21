import { ethers } from 'ethers';
import { Test, TestingModule } from '@nestjs/testing';
import { ADDRESS_STUB } from '../../test/stub/constants';
import { AuthService } from '~/auth/auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate nonce', () => {
    const user = service.generateNonce(ADDRESS_STUB['0x3']);
    expect(user).toBeDefined();
    expect(user.address).toBe(ADDRESS_STUB['0x3']);
    expect(user.nonce).toBeDefined();
    expect(user.expiry).toBeGreaterThan(Date.now());
  });

  it('should get nonce', () => {
    const user = service.generateNonce(ADDRESS_STUB['0x3']);
    const nonce = service.getNonce(ADDRESS_STUB['0x3']);
    expect(nonce).toBe(user.nonce);

    expect(() => service.getNonce(ADDRESS_STUB['0x4'])).toThrowError(
      'Nonce not found',
    );
  });

  it('should validate nonce', () => {
    const user = service.generateNonce(ADDRESS_STUB['0x3']);

    expect(() =>
      service.validateNonce(ADDRESS_STUB['0x3'], 'invalid'),
    ).toThrowError('Invalid nonce');

    const validated = service.validateNonce(ADDRESS_STUB['0x3'], user.nonce);
    expect(validated).toBeTruthy();

    expect(() =>
      service.validateNonce(ADDRESS_STUB['0x3'], user.nonce),
    ).toThrowError('Nonce not found');
  });

  it('should validate expiry', () => {
    service.generateNonce(ADDRESS_STUB['0x3'], Date.now() - 1000);

    expect(() => service.getNonce(ADDRESS_STUB['0x3'])).toThrowError(
      'Expired nonce',
    );
  });

  it('should sign message', async () => {
    const message = 'Hello, world!';
    const wallet = ethers.Wallet.createRandom();
    const signature = await service.signMessage(message, wallet.privateKey);

    expect(signature).toBeDefined();
    expect(signature).toBe(await wallet.signMessage(message));
  });

  it('should sign message', async () => {
    const message = 'Hello, world!';
    const wallet = ethers.Wallet.createRandom();

    const signature = await wallet.signMessage(message);
    const verified = service.verifyMessage(message, signature, wallet.address);

    expect(verified).toBe(wallet.address);
  });
});
