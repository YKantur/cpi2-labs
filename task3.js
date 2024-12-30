function simulateAsync(value, delay, signal) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        return reject(new Error("Aborted"));
      }
  
      const timeoutId = setTimeout(() => {
        resolve(value > 2);
      }, delay);
  
      signal?.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject(new Error("Aborted"));
      });
    });
  }

function asyncFilter(array, asyncPredicate, options = {}) {
  const { debounceTime = 0, parallelism = Infinity, signal } = options;
  return new Promise((resolve) => {
    if (signal?.aborted) {
      return resolve([]);
    }

    const results = [];
    let completedCount = 0;
    let debounceTimeout;
    let runningCount = 0;
    const processingQueue = [...array];

    function processNext() {
      if (signal?.aborted) {
        return;
      }

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

      while (runningCount < parallelism && processingQueue.length > 0) {
        const item = processingQueue.shift();
        runningCount++;
        asyncPredicate(item, signal)
          .then((passes) => {
            if (passes) {
              results.push(item);
            }
          })
          .catch((error) => {
            if (error.message !== "Aborted") {
              console.error("Error during processing:", error);
            }
          })
          .finally(() => {
            completedCount++;
            runningCount--;
            processNext();
          });
      }
    }

    signal?.addEventListener("abort", () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      resolve([]);
    });

    processNext();
  });
}

