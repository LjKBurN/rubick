import { Injectable } from '@ljkburn/snest';

@Injectable
export class ApiService {
  async index() {
    return await Promise.resolve('api test data');
  }
}
