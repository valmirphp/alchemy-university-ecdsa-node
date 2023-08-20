import { AuthNonceDto } from '~/auth/dto/auth.dto';
import { GuestPersona } from '../stub/personas/guest.persona';
import { ADDRESS_STUB } from '../stub/constants';

describe('AuthController (e2e)', () => {
  const guestPersona = new GuestPersona();

  beforeAll(async () => {
    await guestPersona.init();
  });

  afterAll(async () => {
    await guestPersona.close();
  });

  it('/auth/nonce (POST) [200]', async () => {
    const dto: AuthNonceDto = {
      address: ADDRESS_STUB['0x1'],
    };

    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/auth/nonce',
      body: dto,
    });

    response
      .assertNoErrors()
      .toBeDefined('nonce')
      .toBe('address', dto.address)
      .toBeGreaterThan('expiry', Date.now());
  });

  it('/auth/nonce (POST) [400]', async () => {
    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/auth/nonce',
      body: {
        address: 'xpto',
      },
    });

    response.assertStatusHttp(400).assertErrorMessage('Invalid address');
  });
});
