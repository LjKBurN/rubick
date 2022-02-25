import { Controller, Get, Context } from '@ljkburn/snest';
import { render } from '@ljkburn/mycli';
import { ApiService } from '../service/api.service';

@Controller()
class Home {
  constructor(private apiService: ApiService) {}

  @Get()
  async index(ctx: Context) {
    ctx.apiService = this.apiService;
    ctx.body = await render(ctx);
  }

  @Get('list/:id')
  async list(ctx: Context) {
    ctx.body = await render(ctx);
  }
}

export { Home }