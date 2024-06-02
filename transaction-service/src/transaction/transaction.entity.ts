import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TransactionType } from './transaction-type.entity';
import { TransactionStatus } from './transaction-status.entity';

@ObjectType()
export class TransactionEntity {
  @Field()
  transactionExternalId: string;

  @Field((type) => TransactionType)
  transactionType: TransactionType;

  @Field((type) => TransactionStatus)
  transactionStatus: TransactionStatus;

  @Field((type) => Int)
  value: number;

  @Field()
  createdAt: Date;
}
