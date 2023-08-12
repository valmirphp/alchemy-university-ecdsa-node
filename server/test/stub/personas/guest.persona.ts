import { AbstractPersona } from '@nestjs-toolkit/test-suite/personas';
import { AbstractAppTestSuite } from '@nestjs-toolkit/test-suite';
import { FakeUser } from '../types';
import { MainSuite } from '../main-suite';
import { BalanceService } from '~/balance/balance.service';

export class GuestPersona extends AbstractPersona<FakeUser> {
  public user: FakeUser = {
    id: 1,
    username: 'user@demo.com',
  };

  get balanceService(): BalanceService {
    return this.getProvider(BalanceService);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    // override
    // this.context.set('factory', new Foo());
  }

  protected isAuthorized(): boolean {
    return true;
  }

  protected getInstanceSuite(): AbstractAppTestSuite {
    // Important aqui é injetar a class MainSuite
    return new MainSuite();
  }

  protected generateJWT(): string {
    // Aqui ira montar o token que sera injetado no header das requisições
    // return jsonwebtoken.sign({ fake: 1, ...this.user }, 'secret');
    return null;
  }
}
