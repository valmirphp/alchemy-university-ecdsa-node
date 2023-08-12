import { GuestPersona } from './stub/personas/guest.persona';

describe('MainController (e2e)', () => {
  const userPersona = new GuestPersona();

  beforeAll(async () => {
    await userPersona.init();
  });

  afterAll(async () => {
    await userPersona.close();
  });

  it('/ (GET)', async () => {
    const response = await userPersona.http.request({
      method: 'GET',
      url: '/',
    });

    response
      .assertNoErrors()
      .toBe('name', 'Balance blockchain')
      .toBe('version', 'v0.1');
  });
});
