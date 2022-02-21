export function sortByField(arr, fieldName) {
  return arr.sort((prev, current) => prev[fieldName] - current[fieldName]);
}

export function sortReverseByField(arr, fieldName) {
  return arr
    .sort((prev, current) => prev[fieldName] - current[fieldName])
    .reverse();
}

export function pass() {
  return 1;
}
