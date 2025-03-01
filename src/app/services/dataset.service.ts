import { createDataset as createDatasetRepo } from '../repositories/dataset.repository';
import { Dataset } from '../database/entities';

export async function createDataset(
  userId: number,
  fileName: string,
  fileSize: number,
): Promise<Dataset> {
  return createDatasetRepo(userId, fileName, fileSize);
}
