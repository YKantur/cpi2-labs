function simulateAsync(value, delay, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Error("Aborted"));
    const timeoutId = setTimeout(() => resolve(value > 2), delay);
    signal?.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new Error("Aborted"));
    });
  });
}

async function* generateData(array) {
  for (const item of array) yield item;
}

function asyncFilter(asyncIterable, asyncPredicate, options = {}) {
  const { debounceTime = 0, parallelism = Infinity, signal } = options;

  return new Promise(async (resolve, reject) => {
    if (signal?.aborted) return resolve([]);

    const results = [];
    let runningCount = 0;
    let debounceTimeout;
    const iterator = asyncIterable[Symbol.asyncIterator]();

    const processItem = async (item) => {
      if (signal?.aborted) return;
      runningCount++;
      try {
        if (await asyncPredicate(item, signal)) {
          results.push(item);
        }
      } catch (error) {
        if (error.message !== "Aborted")
          console.error("Error during processing:", error);
      } finally {
        runningCount--;
        processNext();
      }
    };

    const processNext = async () => {
      if (signal?.aborted) return;
      if (runningCount < parallelism) {
        const { done, value } = await iterator.next();
        if (!done) {
          processItem(value);
        } else if (runningCount === 0) {
          clearTimeout(debounceTimeout);
          debounceTimeout = setTimeout(() => resolve(results), debounceTime);
        }
      }
    };

    signal?.addEventListener("abort", () => {
      clearTimeout(debounceTimeout);
      resolve([]);
    });

    for (let i = 0; i < parallelism && !signal?.aborted; i++) {
      processNext();
    }
  });
}

async function demoAsyncFilter(
  description,
  numbers,
  predicate,
  options,
  abortTimeout
) {
  const controller = new AbortController();
  const signal = controller.signal;

  console.log(`\nStarting asyncFilter (${description})...`);
  const filterPromise = asyncFilter(generateData(numbers), predicate, {
    ...options,
    signal,
  });

  if (abortTimeout) {
    setTimeout(() => {
      console.log("Aborting...");
      controller.abort();
    }, abortTimeout);
  }

  try {
    const results = await filterPromise;
    console.log(`asyncFilter results (${description}):`, results);
  } catch (error) {
    console.error("Error:", error);
  }
}
