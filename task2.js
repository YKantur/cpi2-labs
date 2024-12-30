function simulateAsync(value, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value > 2);
    }, delay);
  });
}

function createAsyncFilter(useAsyncAwait) {
  return function asyncFilter(
    array,
    asyncPredicate,
    debounceTime = 0,
    parallelism = Infinity
  ) {
    return new Promise((resolve) => {
      const results = [];
      let completedCount = 0;
      let debounceTimeout;
      let runningCount = 0;
      const processingQueue = [...array];
            function processNext() {
        if (processingQueue.length === 0 && runningCount === 0) {
          if (debounceTime > 0) {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
              resolve(results);
            }, debounceTime);
          } else {
            resolve(results);
          }
          return;
        }

