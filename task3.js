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

async function demoAsyncFilterWithAbort() {
  const numbers = [1, 2, 3, 4, 5];
  const controller = new AbortController();
  const signal = controller.signal;

  console.log("Starting asyncFilter with abort and debounce...");
  const filterPromise = asyncFilter(
    numbers,
    (num, signal) => {
      console.log(`Processing (with abort and debounce): ${num}`);
      return simulateAsync(num, 300, signal);
    },
    { signal, debounceTime: 500 }
  );

  setTimeout(() => {
    console.log("Aborting...");
    controller.abort();
  }, 400);

  try {
    const results = await filterPromise;
    console.log("asyncFilter results (with abort and debounce):", results);
  } catch (error) {
    console.log("asyncFilter aborted (catch block):", error.message);
  }
}

async function demoAsyncFilterWithoutAbort() {
  const numbers = [1, 2, 3, 4, 5];

  console.log("Starting asyncFilter without abort, with debounce...");
  const results = await asyncFilter(
    numbers,
    (num, signal) => {
      console.log(`Processing (without abort, with debounce): ${num}`);
      return simulateAsync(num, 300, signal);
    },
    { debounceTime: 500 }
  );
  console.log("asyncFilter results (without abort, with debounce):", results);
}


