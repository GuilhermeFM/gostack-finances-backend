import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

import Category from '../models/Category';

interface TransactionParams {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute(params: TransactionParams): Promise<Transaction> {
    const { title, value, type, category } = params;

    const transactionRepository = getCustomRepository(TransactionRepository);
    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Insuficient funds.', 400);
    }

    const categoryRepository = getRepository(Category);
    let related_category = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!related_category) {
      related_category = categoryRepository.create({ title: category });
      related_category = await categoryRepository.save(related_category);
    }

    const transaction_data = { title, value, type, category_id: related_category.id };
    const transaction = transactionRepository.create(transaction_data);

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
