import fs from 'fs';
import path from 'path';
import csv from 'csvtojson';

import AppError from '../errors/AppError';
import uploadConfig from '../config/upload';
import CreateTransactionsService from './CreateTransactionService';

interface ImportData {
  title: string;
  type: string;
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(transaction_filename: string): Promise<ImportData[]> {
    const csv_path = path.join(uploadConfig.directory, transaction_filename);
    const csv_file_exists = await fs.promises.stat(csv_path);

    if (!csv_file_exists) {
      throw new AppError('Arquivo não encontrado', 500);
    }

    const imports: ImportData[] = await csv().fromFile(csv_path);
    const createTransaction = new CreateTransactionsService();

    // eslint-disable-next-line no-restricted-syntax
    for (const item of imports) {
      const { title, type, value, category } = item;
      // eslint-disable-next-line no-await-in-loop
      await createTransaction.execute({ title, type, value, category });
    }

    return imports;
  }
}

export default ImportTransactionsService;
