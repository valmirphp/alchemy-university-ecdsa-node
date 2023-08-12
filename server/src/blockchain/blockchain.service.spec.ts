import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainService } from '~/blockchain/blockchain.service';

describe('BlockchainService', () => {
  let service: BlockchainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockchainService],
    }).compile();

    service = module.get<BlockchainService>(BlockchainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Geneses', () => {
    const block = service.get(0);

    expect(block.index).toBe(0);

    expect(block.hash).toBe(
      '000dc75a315c77a1f9c98fb6247d03dd18ac52632d7dc6a9920261d8109b37cf',
    );
  });

  it('Started', () => {
    const block = service.latestBlock();
    expect(block.index).toBe(1);

    const data = service.lastData();
    console.log('DATA', data);
    expect(data.startedAt).toBeLessThan(Date.now());
  });
});
