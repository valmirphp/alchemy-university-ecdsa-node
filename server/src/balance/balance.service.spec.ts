import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainModule } from '~/blockchain/blockchain.module';
import { BlockchainService } from '~/blockchain/blockchain.service';
import { BalanceService } from '~/balance/balance.service';

describe('BalanceService', () => {
  let balanceService: BalanceService;
  let blockchainService: BlockchainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BlockchainModule],
      providers: [BalanceService],
    }).compile();

    balanceService = module.get<BalanceService>(BalanceService);
    blockchainService = module.get<BlockchainService>(BlockchainService);
  });

  it('should be defined', () => {
    expect(balanceService).toBeDefined();
  });

  it('Get balance', () => {
    expect(balanceService.getBalance('0x1')).toBe(0);
    expect(blockchainService.latestIndex()).toBe(1);
  });

  it('Update balance', () => {
    // Set Balance
    balanceService.setBalance('0x1', 200);
    balanceService.setBalance('0x2', 100);
    balanceService.setBalance('0x1', 300);
    balanceService.setBalance('0x4', 0);

    // Expect is not updated before commit
    expect(balanceService.getBalance('0x1')).toBe(0);

    // Commit
    balanceService.commit();
    expect(blockchainService.latestIndex()).toBe(2);
    expect(balanceService.getBalance('0x1')).toBe(300);
    expect(balanceService.getBalance('0x2')).toBe(100);
    expect(balanceService.getBalance('0x3')).toBe(0);
    expect(balanceService.getBalance('0x4')).toBe(0);

    // Set Balance
    balanceService.commit();
    expect(blockchainService.latestIndex()).toBe(2); // nao deve minerar, pois esta vazio

    // Block 3
    balanceService.setBalance('0x2', 51);
    balanceService.commit();
    expect(balanceService.getBalance('0x1')).toBe(300);
    expect(balanceService.getBalance('0x2')).toBe(51);
    expect(balanceService.getBalance('0x3')).toBe(0);
    expect(balanceService.getBalance('0x4')).toBe(0);
  });

  it('All balance', () => {
    balanceService.setBalance('0x1', 200);
    balanceService.setBalance('0x2', 100);
    balanceService.setBalance('0x4', 0);

    balanceService.commit();

    const wallets = balanceService.all();

    expect(wallets).toHaveLength(3);
    expect(wallets[0].address).toBe('0x1');
    expect(wallets[0].balance).toBe(200);
  });

  it('Transfer', () => {
    balanceService.setBalance('0x1', 200);
    balanceService.setBalance('0x2', 100);
    balanceService.setBalance('0x4', 0);

    balanceService.commit();
    const currentBlock = blockchainService.latestIndex();

    const result = balanceService.transfer('0x1', '0x2', 22);

    expect(balanceService.getBalance('0x1')).toBe(200 - 22);
    expect(balanceService.getBalance('0x2')).toBe(100 + 22);

    expect(result.balance).toBe(200 - 22);
    expect(result.block).toBe(currentBlock + 1);
  });
});
