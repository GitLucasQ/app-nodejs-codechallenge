import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create.dto';
import { TransactionEntity } from './transaction.entity';

@Resolver()
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query((returns) => [TransactionEntity])
  async transactions(): Promise<TransactionEntity[]> {
    const transactions = (await this.transactionService.findAll())
      .sort((el) => el.id)
      .reverse();

    const result: TransactionEntity[] = transactions?.map((el) => {
      return {
        transactionExternalId: el.guid,
        transactionType: {
          name: 'Transaction',
        },
        transactionStatus: {
          name: el.state,
        },
        value: el.value,
        createdAt: el.createdAt,
      };
    });

    return result;
  }

  @Query((returns) => TransactionEntity)
  async transaction(
    @Args('transactionExternalId') transactionExternalId: string,
  ): Promise<TransactionEntity> {
    const transactionFounded = await this.transactionService.findByGuid(
      transactionExternalId,
    );

    const result: TransactionEntity = {
      transactionExternalId: transactionFounded.guid,
      transactionType: {
        name: 'Transaction',
      },
      transactionStatus: {
        name: transactionFounded.state,
      },
      value: transactionFounded.value,
      createdAt: transactionFounded.createdAt,
    };

    return result;
  }

  @Mutation((returns) => TransactionEntity)
  async createTransaction(
    @Args('createTransaction') createTransactionDto: CreateTransactionDto,
  ) {
    const transactionCreated =
      await this.transactionService.create(createTransactionDto);

    const result: TransactionEntity = {
      transactionExternalId: transactionCreated.guid,
      transactionType: {
        name: 'Transaction',
      },
      transactionStatus: {
        name: transactionCreated.state,
      },
      value: transactionCreated.value,
      createdAt: transactionCreated.createdAt,
    };

    return result;
  }
}
