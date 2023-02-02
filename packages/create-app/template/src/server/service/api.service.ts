import { Injectable } from 'snest';

@Injectable()
export class ApiService {
  async index() {
    return await Promise.resolve('api test data');
  }

  async detail(id: string) {
    return await Promise.resolve(`list ${id} detail data`);
  }
}
