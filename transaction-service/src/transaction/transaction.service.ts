import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Transaction as TransactionModel } from './models/transaction.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    @InjectRepository(TransactionModel)
    private transactionRepository: Repository<TransactionModel>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('transaction_created');
    await this.kafkaClient.connect();
  }

  findAll(): Promise<TransactionModel[]> {
    return this.transactionRepository.find();
  }

  findByGuid(guid: string): Promise<TransactionModel> {
    return this.transactionRepository.findOneBy({
      guid: guid,
    });
  }

  async create(
    transactionRequest: CreateTransactionDto,
  ): Promise<TransactionModel> {
    const newTransaction =
      this.transactionRepository.create(transactionRequest);
    newTransaction.state = 'pending';
    const savedTransaction =
      await this.transactionRepository.save(newTransaction);

    // Publicar el mensaje en el topic de Kafka
    const payloadToEmit: any = {
      id: savedTransaction.id,
      amount: transactionRequest.value,
    };

    this.kafkaClient.emit('transaction_created', payloadToEmit);

    return savedTransaction;
  }

  async updateStatus(id: number, status: string) {
    const transactionFounded = await this.transactionRepository.findOneBy({
      id: id,
    });

    if (transactionFounded) {
      transactionFounded.state = status;
      this.transactionRepository.save(transactionFounded);
    }
  }
}
