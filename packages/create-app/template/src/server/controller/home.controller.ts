import { Controller, Get, Context } from '@ljkburn/snest';
import { render } from '@ljkburn/webick';
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