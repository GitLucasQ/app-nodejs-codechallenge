import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('transaction_created')
  public validateTransaction(@Payload() payload: any) {
    let result: boolean = false;

    if (payload.amount < 1000) {
      result = true;
    }

    this.kafkaClient.emit('transaction_validation_result', {
      id: payload.id,
      result,
    });
  }
}
