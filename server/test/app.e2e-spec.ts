import { GuestPersona } from './stub/personas/guest.persona';

describe('AppController (e2e)', () => {
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

    response.statusOK();

    expect(response.bodyRaw).toBe('Hello World!');
  });
});
