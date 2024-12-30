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

        while (runningCount < parallelism && processingQueue.length > 0) {
          const item = processingQueue.shift();
          runningCount++;
          const predicatePromise = asyncPredicate(item);

          const completionHandler = (passes) => {
            if (passes) {
              results.push(item);
            }
            completedCount++;
            runningCount--;
            processNext();
          };

          if (useAsyncAwait) {
            predicatePromise.then(completionHandler);
          } else {
            predicatePromise.then(completionHandler);
          }
        }
      }
      processNext();
    });
  };
}

const asyncFilterPromise = createAsyncFilter(false);
const asyncFilterAsyncAwait = createAsyncFilter(true);

function demoAsyncFilterPromise() {
  const numbers = [1, 2, 3, 4, 5];

  console.log("Starting asyncFilterPromise with debounce...");
  asyncFilterPromise(
    numbers,
    (num) => {
      console.log(`Processing (promise with debounce): ${num}`);
      return simulateAsync(num, 300);
    },
    500
  ).then((results) =>
    console.log("asyncFilterPromise results (with debounce):", results)
  );

    console.log("Starting asyncFilterPromise without debounce...");
  asyncFilterPromise(numbers, (num) => {
    console.log(`Processing (promise without debounce): ${num}`);
    return simulateAsync(num, 100);
  }).then((results) =>
    console.log("asyncFilterPromise results (without debounce):", results)
  );

  console.log("Starting asyncFilterPromise with parallelism (2)...");
  asyncFilterPromise(
    numbers,
    (num) => {
      console.log(`Processing (promise with parallelism): ${num}`);
      return simulateAsync(num, 200);
    },
    0,
    2
  ).then((results) =>
    console.log("asyncFilterPromise results (with parallelism):", results)
  );
}

async function demoAsyncFilterAsyncAwait() {
  const numbers = [1, 2, 3, 4, 5];

  console.log("Starting asyncFilterAsyncAwait with debounce...");
  const resultsWithDebounce = await asyncFilterAsyncAwait(
    numbers,
    async (num) => {
      console.log(`Processing (async/await with debounce): ${num}`);
      return simulateAsync(num, 300);
    },
    500
  );
  console.log(
    "asyncFilterAsyncAwait results (with debounce):",
    resultsWithDebounce
  );
    console.log("Starting asyncFilterAsyncAwait without debounce...");
  const resultsWithoutDebounce = await asyncFilterAsyncAwait(
    numbers,
    async (num) => {
      console.log(`Processing (async/await without debounce): ${num}`);
      return simulateAsync(num, 100);
    }
  );
  console.log(
    "asyncFilterAsyncAwait results (without debounce):",
    resultsWithoutDebounce
  );

  console.log("Starting asyncFilterAsyncAwait with parallelism (2)...");
  const resultsWithParallelism = await asyncFilterAsyncAwait(
    numbers,
    async (num) => {
      console.log(`Processing (async/await with parallelism): ${num}`);
      return simulateAsync(num, 200);
    },
    0,
    2
  );
  console.log(
    "asyncFilterAsyncAwait results (with parallelism):",
    resultsWithParallelism
  );
}


