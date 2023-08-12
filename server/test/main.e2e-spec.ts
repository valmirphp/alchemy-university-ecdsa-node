import { GuestPersona } from './stub/personas/guest.persona';

describe('MainController (e2e)', () => {
  const guestPersona = new GuestPersona();

  beforeAll(async () => {
    await guestPersona.init();
  });

  afterAll(async () => {
    await guestPersona.close();
  });

  it('/ (GET)', async () => {
    const response = await guestPersona.http.request({
      method: 'GET',
      url: '/',
    });

    response
      .assertNoErrors()
      .toBe('name', 'Balance blockchain')
      .toBe('version', 'v0.1');
  });
});
