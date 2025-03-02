import { table } from 'table';
import CacheService from './src/app/services/cache.service';

async function readLevelDB() {
  try {
    console.info('Fetching cache entries...\n');

    const entries = await CacheService.getAll();

    if (entries.length === 0) {
      console.info('Cache is empty.');
      return;
    }

    const tableData = [['🔑 Key', '📄 Value', '⏳ Expires At']];

    entries.forEach(({ key, value, expiresAt }) => {
      tableData.push([key, JSON.stringify(value, null, 2), expiresAt]);
    });

    console.info(table(tableData));
  } catch (error) {
    console.error('Error reading from cache:', error);
  }
}

readLevelDB().catch(console.error);
