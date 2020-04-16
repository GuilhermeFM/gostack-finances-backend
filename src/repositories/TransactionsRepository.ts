import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const { total: total_income } = await this.createQueryBuilder('transactions')
      .where('transactions.type = :type', { type: 'income' })
      .select('SUM(COALESCE(transactions.value, 0))', 'total')
      .getRawOne();

    const { total: total_outcome } = await this.createQueryBuilder('transactions')
      .where('transactions.type = :type', { type: 'outcome' })
      .select('SUM(COALESCE(transactions.value, 0))', 'total')
      .getRawOne();

    const balance = total_income - total_outcome;

    return { income: total_income, outcome: total_outcome, total: balance };
  }
}

export default TransactionsRepository;
