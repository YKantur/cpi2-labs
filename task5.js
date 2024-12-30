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

  const itemStart$ = new Subject();
  const itemComplete$ = new Subject();
  const itemPassed$ = new Subject();
  const filterStart$ = new Subject();
  const filterComplete$ = new Subject();
  const filterAborted$ = new Subject();

  filterStart$.next();

  const resultsPromise = new Promise(async (resolve) => {
    if (signal?.aborted) {
      filterAborted$.next();
      filterComplete$.next([]); // Emit empty array event on abort
      return resolve([]);
    }

    const results = [];
    let runningCount = 0;
    let debounceTimeout;
    const iterator = asyncIterable[Symbol.asyncIterator]();

    const processItem = async (item) => {
      if (signal?.aborted) return;
      runningCount++;
      itemStart$.next(item);
      try {
        const passes = await asyncPredicate(item, signal);
        itemComplete$.next({ item, success: passes });
        if (passes) {
          itemPassed$.next(item);
          results.push(item);
        }
      } catch (error) {
        itemComplete$.next({ item, success: false, error });
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
          debounceTimeout = setTimeout(() => {
            filterComplete$.next(results);
            resolve(results);
          }, debounceTime);
        }
      }
    };

    signal?.addEventListener("abort", () => {
      clearTimeout(debounceTimeout);
      filterAborted$.next();
      filterComplete$.next([]); // Emit empty array event on abort
      resolve([]);
    });

    for (let i = 0; i < parallelism && !signal?.aborted; i++) {
      processNext();
    }
  });

  return {
    resultsPromise,
    itemStart$,
    itemComplete$,
    itemPassed$,
    filterStart$,
    filterComplete$,
    filterAborted$,
  };
}
