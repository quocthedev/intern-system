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
