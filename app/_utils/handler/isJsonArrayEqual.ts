export const isJsonArrayEqual = (arr1: any, arr2: any) => {
  if (arr1.length !== arr2.length) return false;

  // Sort arrays by itemId to ensure order consistency
  const sortedArr1 = [...arr1].sort((a, b) => a.itemId - b.itemId);
  const sortedArr2 = [...arr2].sort((a, b) => a.itemId - b.itemId);

  // Convert both arrays to JSON and compare
  return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2);
};
