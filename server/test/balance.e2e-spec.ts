import { GuestPersona } from './stub/personas/guest.persona';

describe('BalanceController (e2e)', () => {
  const guestPersona = new GuestPersona();

  beforeAll(async () => {
    await guestPersona.init();

    guestPersona.balanceService.setBalance('0x1', 50);
    guestPersona.balanceService.commit();
  });

  afterAll(async () => {
    await guestPersona.close();
  });

  it('/balance/0x1 (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: '/balance/0x1',
    });

    response.assertNoErrors().toBe('balance', 50);
  });

  it('/balance/0x2 (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: '/balance/0x2',
    });

    response.assertNoErrors().toBe('balance', 0);
  });

  it('/balance/0x1/faucet (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: '/balance/0x1/faucet',
    });

    response.assertNoErrors().toBe('balance', 51);
  });

  it('/balance/0x3/faucet (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: '/balance/0x2/faucet',
    });

    response.assertNoErrors().toBe('balance', 1);
  });
});
