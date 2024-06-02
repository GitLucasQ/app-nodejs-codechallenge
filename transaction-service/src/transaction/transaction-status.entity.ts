import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionStatus {
  @Field()
  name: string;
}
