import { AbstractPersona } from '@nestjs-toolkit/test-suite/personas';
import { AbstractAppTestSuite } from '@nestjs-toolkit/test-suite';
import { BalanceService } from '~/balance/balance.service';
import { AuthService } from '~/auth/auth.service';
import { MainSuite } from '../main-suite';
import { FakeUser } from '../types';

export class GuestPersona extends AbstractPersona<FakeUser> {
  public user: FakeUser = {
    id: 1,
    username: 'user@demo.com',
  };

  get balanceService(): BalanceService {
    return this.getProvider(BalanceService);
  }

  get authService(): AuthService {
    return this.getProvider(AuthService);
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
