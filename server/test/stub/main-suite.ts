import { Test, TestingModule } from '@nestjs/testing';
import { AbstractAppTestSuite } from '@nestjs-toolkit/test-suite';
import { MainModule } from '~/main.module';

export class MainSuite extends AbstractAppTestSuite {
  protected async createTestingModule(): Promise<TestingModule> {
    const module = Test.createTestingModule({
      imports: [MainModule],
    });

    return module.compile();
  }

  protected async beforeInitApp(): Promise<void> {
    // override
    await super.beforeInitApp();
  }

  async close(): Promise<void> {
    // override
    await super.close();
  }
}
