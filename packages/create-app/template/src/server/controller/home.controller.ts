import { Controller, Get, Context } from 'snest';
import { render } from 'webick';
import { ApiService } from '../service/api.service';

@Controller()
class Home {
  constructor(private apiService: ApiService) {}

  @Get()
  async index(ctx: Context) {
    ctx.body = await render(ctx);
  }

  @Get('list/:id')
  async list(ctx: Context) {
    ctx.body = await render(ctx);
  }

  @Get('list/:id/detail')
  async detail(ctx: Context) {
    ctx.apiService = this.apiService;
    ctx.body = await render(ctx);
  }
}

export { Home }