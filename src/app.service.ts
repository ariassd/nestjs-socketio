import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      status: 'Ok',
      message: 'Service alive',
      date: new Date().toISOString(),
    };
  }
}
