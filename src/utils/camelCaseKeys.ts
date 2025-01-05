export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (match) => match[1].toUpperCase());
};

export const camelCaseKeys = <T extends object>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelCaseKeys(v)) as unknown as T;
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = toCamelCase(key);
      const value = (obj as Record<string, unknown>)[key];
      result[camelKey] =
        typeof value === "object" && value !== null
          ? camelCaseKeys(value)
          : value;
      return result;
    }, {} as Record<string, unknown>) as T;
  }
  return obj;
};
