import { Controller, Get, Post, Context } from '@ljkburn/snest';
import { ApiService } from '../service/api.service';

@Controller('api')
class Api {
  constructor(private apiService: ApiService) {}

  @Get('index')
  async indexRequest(ctx: Context) {
    ctx.body = await this.apiService.index();
  }

  @Post('detail')
  async detailRequest(ctx: Context) {
    const { id } = ctx.request.body;
    ctx.body = await this.apiService.detail(id);
  }
}

export { Api }