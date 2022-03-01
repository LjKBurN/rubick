import { Context } from 'koa';
import { Controller, Get, Injectable } from '../src';

@Injectable()
class AllList {
  log() {
    console.log('Ha');
  }

  count(): string {
    return 'list: 1,2,3';
  }
}

@Controller()
class Xiao {
  constructor(private inject: AllList) {}

  @Get('/test')
  test2(ctx: Context) {
    console.log('test2');
  }

  @Get('/test/api')
  test1(ctx: Context) {
    ctx.body = 'Hello';
    console.log('test1');
  }
}

export { Xiao }