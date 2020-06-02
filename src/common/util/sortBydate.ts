const sortByDate = <TObj extends Record<TKey, string>, TKey extends keyof TObj>(
  fieldName: TKey
) => (a: TObj, b: TObj): number => {
  const dateA = new Date(a[fieldName]);
  const dateB = new Date(b[fieldName]);
  return dateB.getTime() - dateA.getTime();
};

export default sortByDate;
