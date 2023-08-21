import { GuestPersona } from '../stub/personas/guest.persona';
import { ADDRESS_STUB } from '../stub/constants';

describe('BalanceController (e2e)', () => {
  const guestPersona = new GuestPersona();

  beforeAll(async () => {
    await guestPersona.init();

    guestPersona.balanceService.setBalance(ADDRESS_STUB['0x1'], 50);
    guestPersona.balanceService.commit();
  });

  afterAll(async () => {
    await guestPersona.close();
  });

  it('/balance (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: `/balance`,
    });

    response
      .assertNoErrors()
      .toHaveLength('', 1)
      .toBe('0.address', ADDRESS_STUB['0x1'])
      .toBe('0.balance', 50);
  });

  it('/balance/0x1 (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: `/balance/${ADDRESS_STUB['0x1']}`,
    });

    response.assertNoErrors().toBe('balance', 50);
  });

  it('/balance/0x2 (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: `/balance/${ADDRESS_STUB['0x2']}`,
    });

    response.assertNoErrors().toBe('balance', 0);
  });

  it('/balance/xxx (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: `/balance/xxx`,
    });

    response.assertStatusHttp(400).assertErrorMessage('Invalid address');
  });

  it('/balance/0x1/faucet (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: `/balance/${ADDRESS_STUB['0x1']}/faucet`,
    });

    response.assertNoErrors().toBe('balance', 51);
  });

  it('/balance/0x3/faucet (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: `/balance/${ADDRESS_STUB['0x2']}/faucet`,
    });

    response.assertNoErrors().toBe('balance', 1);
  });
});
