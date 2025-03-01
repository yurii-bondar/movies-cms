/**
 * @function errorLogUtil
 * @desc Returns a logging function that logs errors with a formatted message.
 * @param {string} filename - The filename where the error occurs.
 * @returns {(method: string, err: unknown) => void} - A function that logs errors.
 */
export default function errorLogUtil(filename: string): (method: string, err: unknown) => void {
  return function logError(method: string, err: unknown): void {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`${filename}/${method} error: `, errorMessage);
  };
}
