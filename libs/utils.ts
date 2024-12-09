export const getUpdatedFields = <T extends Record<string, any>>(
  oldObj: T,
  newObj: T,
): Partial<T> => {
  return Object.keys(newObj).reduce((acc, key) => {
    if (newObj[key] !== oldObj[key]) {
      (acc as Record<string, any>)[key] = newObj[key];
    }

    return acc;
  }, {} as Partial<T>);
};

export const removeEmptyFields = <T extends Record<string, any> | null>(
  obj: T,
): Partial<T> => {
  const emptyValues = ["", null, undefined];

  if (!obj) {
    return {} as Partial<T>;
  }

  return Object.keys(obj).reduce((acc, key) => {
    if (!emptyValues.includes(obj[key])) {
      (acc as Record<string, any>)[key] = obj[key];
    }

    return acc;
  }, {} as Partial<T>);
};
