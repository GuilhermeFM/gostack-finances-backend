import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(transaction_id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const transaction = await transactionRepository.find({
      where: { id: transaction_id },
    });

    if (!transaction || transaction.length === 0) {
      throw new AppError('Transaction not found', 400);
    }

    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
