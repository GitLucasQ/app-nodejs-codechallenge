import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('uuid', { default: () => 'uuid_generate_v4()', generated: 'uuid' })
  guid: string;

  @Field()
  @Column()
  accountExternalIdDebit: string;

  @Field()
  @Column()
  accountExternalIdCredit: string;

  @Field()
  @Column()
  tranferTypeId: number;

  @Field((type) => Int)
  @Column()
  value: number;

  @Field()
  @Column()
  state: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP()' })
  createdAt: Date;
}
