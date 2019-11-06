import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { MathService } from './math.service';
import { MessagePattern } from '@nestjs/microservices';
@Controller()
export class AppController {
  private logger = new Logger('AppController');
  constructor(private mathService: MathService) {}

  // @Post('add')
  // Define the message pattern for this method
  @MessagePattern('add')
  async accumulate(@Body('data') data: number[]) {
    this.logger.log('Adding ' + data.toString());
    return this.mathService.accumulate(data);
  }
}
