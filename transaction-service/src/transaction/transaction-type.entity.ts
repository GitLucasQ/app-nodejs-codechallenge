import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionType {
  @Field()
  name: string;
}
