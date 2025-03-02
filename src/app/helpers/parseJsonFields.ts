export default function parseJsonFields(obj: any): any {
  if (typeof obj === 'string') {
    try {
      return JSON.parse(obj);
    } catch {
      return obj;
    }
  } else if (Array.isArray(obj)) {
    return obj.map(parseJsonFields);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, parseJsonFields(value)]),
    );
  }
  return obj;
}
