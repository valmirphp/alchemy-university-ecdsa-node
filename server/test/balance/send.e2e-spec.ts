import { ethers } from 'ethers';
import { SendDataDto, SendDto } from '~/balance/dto/send.dto';
import { GuestPersona } from '../stub/personas/guest.persona';
import { ADDRESS_STUB } from '../stub/constants';

describe('SendController (e2e)', () => {
  const guestPersona = new GuestPersona();
  const wallet1 = ethers.Wallet.createRandom();
  const wallet2 = ethers.Wallet.createRandom();

  beforeAll(async () => {
    await guestPersona.init();

    guestPersona.balanceService.setBalance(wallet1.address, 50);
    guestPersona.balanceService.commit();
  });

  afterAll(async () => {
    await guestPersona.close();
  });

  it('Success', async () => {
    const dto: SendDto =
      await guestPersona.authService.signTransaction<SendDataDto>(
        wallet1.privateKey,
        {
          sender: wallet1.address,
          recipient: ADDRESS_STUB['0x2'],
          amount: 10,
        },
      );

    console.log('dto', dto);

    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response.assertNoErrors().toBe('balance', 40).toBe('block', 3);
  });

  it('Invalid nonce', async () => {
    const dto: SendDto =
      await guestPersona.authService.signTransaction<SendDataDto>(
        wallet1.privateKey,
        {
          sender: wallet1.address,
          recipient: ADDRESS_STUB['0x2'],
          amount: 10,
        },
      );

    guestPersona.authService.generateNonce(wallet1.address);

    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response.assertStatusHttp(401).assertErrorMessage('Invalid nonce');
  });

  it('Invalid hash', async () => {
    const dto: SendDto =
      await guestPersona.authService.signTransaction<SendDataDto>(
        wallet1.privateKey,
        {
          sender: wallet1.address,
          recipient: ADDRESS_STUB['0x2'],
          amount: 10,
        },
      );

    dto.data.amount = 100;

    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response.assertStatusHttp(401).assertErrorMessage('Invalid hash');
  });

  it('Invalid signature', async () => {
    const dto: SendDto =
      await guestPersona.authService.signTransaction<SendDataDto>(
        wallet1.privateKey,
        {
          sender: wallet1.address,
          recipient: ADDRESS_STUB['0x2'],
          amount: 10,
        },
      );

    dto.signature = await guestPersona.authService.signMessage(
      "I'm a hacker",
      wallet1.privateKey,
    );

    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response.assertStatusHttp(401).assertErrorMessage('Invalid signature');
  });

  it('Override signature', async () => {
    const dto: SendDto =
      await guestPersona.authService.signTransaction<SendDataDto>(
        wallet1.privateKey,
        {
          sender: wallet1.address,
          recipient: ADDRESS_STUB['0x2'],
          amount: 10,
        },
      );

    dto.signature = await guestPersona.authService.signMessage(
      dto.hash,
      wallet2.privateKey, // assinado com outro wallet
    );

    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response.assertStatusHttp(401).assertErrorMessage('Invalid signature');
  });

  it('Override sender', async () => {
    const dto: SendDto =
      await guestPersona.authService.signTransaction<SendDataDto>(
        wallet1.privateKey,
        {
          sender: ADDRESS_STUB['0x2'],
          recipient: ADDRESS_STUB['0x3'],
          amount: 10,
        },
      );

    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response.assertStatusHttp(401).assertErrorMessage('Invalid signature');
  });

  it('should duplicate transaction', async () => {
    const dto: SendDto =
      await guestPersona.authService.signTransaction<SendDataDto>(
        wallet1.privateKey,
        {
          sender: wallet1.address,
          recipient: ADDRESS_STUB['0x2'],
          amount: 10,
        },
      );

    const response1 = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response1.statusOK();

    const response2 = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response2.assertStatusHttp(404).assertErrorMessage('Nonce not found');
  });

  it('Sender and recipient must be different!', async () => {
    const dto: SendDto =
      await guestPersona.authService.signTransaction<SendDataDto>(
        wallet1.privateKey,
        {
          sender: wallet1.address,
          recipient: wallet1.address,
          amount: 10,
        },
      );

    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response.assertErrorMessage('Sender and recipient must be different!');
  });

  it('Not enough funds!', async () => {
    const dto: SendDto =
      await guestPersona.authService.signTransaction<SendDataDto>(
        wallet1.privateKey,
        {
          sender: wallet1.address,
          recipient: ADDRESS_STUB['0x2'],
          amount: 100,
        },
      );

    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response.assertErrorMessage('Not enough funds!');
  });

  it('[0x4] Not enough funds!', async () => {
    const dto: SendDto =
      await guestPersona.authService.signTransaction<SendDataDto>(
        wallet2.privateKey,
        {
          sender: wallet2.address,
          recipient: ADDRESS_STUB['0x2'],
          amount: 1,
        },
      );

    const response = await guestPersona.http.request({
      method: 'POST',
      url: '/send',
      body: dto,
    });

    response.assertErrorMessage('Not enough funds!');
  });
});
