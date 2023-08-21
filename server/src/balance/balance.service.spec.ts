import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainModule } from '~/blockchain/blockchain.module';
import { BlockchainService } from '~/blockchain/blockchain.service';
import { BalanceService } from '~/balance/balance.service';

describe('BalanceService', () => {
  const address = {
    '0x1': '0x159686F47D5e6B85C6Ff078E48C3A0a8efffd8d6',
    '0x2': '0x8b3dadaCAcCD81D86bb909095c8f5DD6bb45bbCe',
    '0x3': '0x64E5593466f1121d3C087f1f7b52a66BbdF194eB',
    '0x4': '0xB09F72915e4a366d9daf1799eC2991abF37D8F7f',
  };

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
    expect(balanceService.getBalance(address['0x1'])).toBe(0);
    expect(blockchainService.latestIndex()).toBe(1);
  });

  it('Update balance', () => {
    // Set Balance
    balanceService.setBalance(address['0x1'], 200);
    balanceService.setBalance(address['0x2'], 100);
    balanceService.setBalance(address['0x1'], 300);
    balanceService.setBalance(address['0x4'], 0);

    // Expect is not updated before commit
    expect(balanceService.getBalance(address['0x1'])).toBe(0);

    // Commit
    balanceService.commit();
    expect(blockchainService.latestIndex()).toBe(2);
    expect(balanceService.getBalance(address['0x1'])).toBe(300);
    expect(balanceService.getBalance(address['0x2'])).toBe(100);
    expect(balanceService.getBalance(address['0x3'])).toBe(0);
    expect(balanceService.getBalance(address['0x4'])).toBe(0);

    // Set Balance
    balanceService.commit();
    expect(blockchainService.latestIndex()).toBe(2); // nao deve minerar, pois esta vazio

    // Block 3
    balanceService.setBalance(address['0x2'], 51);
    balanceService.commit();
    expect(balanceService.getBalance(address['0x1'])).toBe(300);
    expect(balanceService.getBalance(address['0x2'])).toBe(51);
    expect(balanceService.getBalance(address['0x3'])).toBe(0);
    expect(balanceService.getBalance(address['0x4'])).toBe(0);
  });

  it('All balance', () => {
    balanceService.setBalance(address['0x1'], 200);
    balanceService.setBalance(address['0x2'], 100);
    balanceService.setBalance(address['0x4'], 0);

    balanceService.commit();

    const wallets = balanceService.all();

    expect(wallets).toHaveLength(3);
    expect(wallets[0].address).toBe(address['0x1']);
    expect(wallets[0].balance).toBe(200);
  });

  it('Transfer', () => {
    balanceService.setBalance(address['0x1'], 200);
    balanceService.setBalance(address['0x2'], 100);
    balanceService.setBalance(address['0x4'], 0);

    balanceService.commit();
    const currentBlock = blockchainService.latestIndex();

    const result = balanceService.transfer(address['0x1'], address['0x2'], 22);

    expect(balanceService.getBalance(address['0x1'])).toBe(200 - 22);
    expect(balanceService.getBalance(address['0x2'])).toBe(100 + 22);

    expect(result.balance).toBe(200 - 22);
    expect(result.block).toBe(currentBlock + 1);
    expect(result.tx).toBeDefined();

    const lastBlock = blockchainService.latestBlock();
    const data = JSON.parse(lastBlock.data);
    console.log(data);

    expect(data.events).toHaveLength(1);
    expect(data.events[0].kind).toBe('transfer');
    expect(data.events[0].from).toBe(address['0x1']);
    expect(data.events[0].tx).toBe(result.tx);
    expect(data.events[0].data.amount).toBe(22);
    expect(data.events[0].data.sender).toBe(address['0x1']);
    expect(data.events[0].data.recipient).toBe(address['0x2']);
  });
});
