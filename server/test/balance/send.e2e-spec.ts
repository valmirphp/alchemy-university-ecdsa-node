import { SendDto } from '~/balance/dto/send.dto';
import { GuestPersona } from '../stub/personas/guest.persona';
import { ADDRESS_STUB } from '../stub/constants';

describe('SendController (e2e)', () => {
  const guestPersona = new GuestPersona();

  beforeAll(async () => {
    await guestPersona.init();

    guestPersona.balanceService.setBalance(ADDRESS_STUB['0x1'], 50);
    guestPersona.balanceService.commit();
  });

  afterAll(async () => {
    await guestPersona.close();
  });

  it('Success', async () => {
    const dto: SendDto = {
      sender: ADDRESS_STUB['0x1'],
      recipient: ADDRESS_STUB['0x2'],
      amount: 10,
    };

    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response.assertNoErrors().dump().toBe('balance', 40).toBe('block', 3);
  });

  it('Sender and recipient must be different!', async () => {
    const dto: SendDto = {
      sender: ADDRESS_STUB['0x1'],
      recipient: ADDRESS_STUB['0x1'],
      amount: 10,
    };

    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response.assertErrorMessage('Sender and recipient must be different!');
  });

  it('Not enough funds!', async () => {
    const dto: SendDto = {
      sender: ADDRESS_STUB['0x1'],
      recipient: ADDRESS_STUB['0x2'],
      amount: 100,
    };

    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response.assertErrorMessage('Not enough funds!');
  });

  it('[0x4] Not enough funds!', async () => {
    const dto: SendDto = {
      sender: ADDRESS_STUB['0x4'],
      recipient: ADDRESS_STUB['0x2'],
      amount: 1,
    };

    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response.assertErrorMessage('Not enough funds!');
  });
});
