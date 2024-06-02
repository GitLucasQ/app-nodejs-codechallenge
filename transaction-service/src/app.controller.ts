import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction/transaction.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly transactionService: TransactionService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('transaction_validation_result')
  public async validateTransaction(@Payload() payload: any) {
    await this.transactionService.updateStatus(
      payload.id,
      payload.result ? 'approved' : 'rejected',
    );
  }
}
