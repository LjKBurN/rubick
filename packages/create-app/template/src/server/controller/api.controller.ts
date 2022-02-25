import { Controller, Get, Context } from '@ljkburn/snest';
import { ApiService } from '../service/api.service';

@Controller('api')
class Api {
  constructor(private apiService: ApiService) {}

  @Get('index')
  async indexRequest(ctx: Context) {
    ctx.body = await this.apiService.index();
  }
}

export { Api }