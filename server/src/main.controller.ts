import { Controller, Get } from '@nestjs/common';

@Controller()
export class MainController {
  @Get()
  getHello() {
    return {
      name: 'Balance blockchain',
      version: 'v0.1',
    };
  }
}
