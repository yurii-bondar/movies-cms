import { Dataset } from '../database/entities';

export async function createDataset(
  userId: number,
  fileName: string,
  bytesSize: number,
): Promise<Dataset> {
  return Dataset.create({
    userId,
    fileName,
    bytesSize,
    addDate: new Date(),
  });
}
