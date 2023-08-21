import { GuestPersona } from '../stub/personas/guest.persona';
import { ADDRESS_STUB } from '../stub/constants';

describe('BlockchainController (e2e)', () => {
  const guestPersona = new GuestPersona();

  let tx: string;

  beforeAll(async () => {
    await guestPersona.init();

    guestPersona.balanceService.setBalance(ADDRESS_STUB['0x1'], 50);

    tx = guestPersona.balanceService.setEvent('fake', ADDRESS_STUB['0x1'], {
      foo: 'bar',
    });

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

  it('/blockchain/1 (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: '/blockchain/1',
    });

    response.assertNoErrors().toBe('index', 1);
  });

  it('/blockchain/404 (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: '/blockchain/404',
    });

    response.assertStatusHttp(404).assertErrorMessage('Block not found');
  });

  it('/blockchain/last-block (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: '/blockchain/last-block',
    });

    response.assertNoErrors().toBe('index', 2);
  });

  it('/blockchain/events (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: `/blockchain/events`,
    });

    response.assertNoErrors().toHaveLength('', 1);
  });

  it('/blockchain/events/{tx} (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: `/blockchain/events/${tx}`,
    });

    response.assertNoErrors().toBe('tx', tx).toBe('data.foo', 'bar');
  });
});
