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

async function demoAsyncFilterWithRxJS() {
  const numbers = [1, 2, 3, 4, 5];
  const controller = new AbortController();
  const signal = controller.signal;

  console.log("\nStarting asyncFilter with RxJS...");
  const filterObservable = asyncFilter(
    generateData(numbers),
    (num, signal) => {
      console.log(`Processing (with RxJS): ${num}`);
      return simulateAsync(num, 300, signal);
    },
    { signal, debounceTime: 500, parallelism: 2 }
  );

  const filterPromise = filterObservable.resultsPromise;

  const itemStartSubscription = filterObservable.itemStart$.subscribe((item) =>
    console.log("Item processing started:", item)
  );
  const itemCompleteSubscription = filterObservable.itemComplete$.subscribe(
    (result) => console.log("Item processing completed:", result)
  );
  const itemPassedSubscription = filterObservable.itemPassed$.subscribe(
    (item) => console.log("Item passed filter:", item)
  );
  const filterStartSubscription = filterObservable.filterStart$.subscribe(() =>
    console.log("Filter process started.")
  );
  const filterCompleteSubscription = filterObservable.filterComplete$.subscribe(
    (results) => {
      console.log("Filter process completed. Results:", results);
      itemStartSubscription.unsubscribe();
      itemCompleteSubscription.unsubscribe();
      itemPassedSubscription.unsubscribe();
      filterStartSubscription.unsubscribe();
      filterAbortedSubscription.unsubscribe();
      filterCompleteSubscription.unsubscribe();
    }
  );

  const filterAbortedSubscription = filterObservable.filterAborted$.subscribe(
    () => {
      console.log("Filter process was aborted.");
      itemStartSubscription.unsubscribe();
      itemCompleteSubscription.unsubscribe();
      itemPassedSubscription.unsubscribe();
      filterStartSubscription.unsubscribe();
      filterAbortedSubscription.unsubscribe();
    }
  );

  setTimeout(() => {
    console.log("Aborting...");
    controller.abort();
  }, 400);

  try {
    await filterPromise;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Commit 5: Execute demo function
demoAsyncFilterWithRxJS();
