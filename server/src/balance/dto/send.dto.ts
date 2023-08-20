import { TransactionEntity } from '~/auth/transaction.entity';

export type SendDataDto = {
  sender: string;
  recipient: string;
  amount: number;
};

export type SendDto = TransactionEntity<SendDataDto>;
