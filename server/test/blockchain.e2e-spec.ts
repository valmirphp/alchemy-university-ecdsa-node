import { GuestPersona } from './stub/personas/guest.persona';

describe('BlockchainController (e2e)', () => {
  const guestPersona = new GuestPersona();

  beforeAll(async () => {
    await guestPersona.init();

    guestPersona.balanceService.setBalance('0x1', 50);
    guestPersona.balanceService.commit();
  });

  afterAll(async () => {
    await guestPersona.close();
  });

  it('/blockchain (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: '/blockchain',
    });

    response.assertNoErrors().toHaveLength('', 3);
  });

  it('/blockchain/last-block (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: '/blockchain/last-block',
    });

    response.assertNoErrors().toBe('index', 2);
  });
});
