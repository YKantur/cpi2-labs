function simulateAsync(value, delay, callback) {
  // simulates an asynchronous operation
  setTimeout(() => {
    callback(value > 2);
  }, delay);
}

function asyncFilter(array, asyncPredicate, finalCallback, debounceTime = 0) {
  const results = []; // will store the results of the filtering
  let completedCount = 0;
  let debounceTimeout;

  function handleCompletion(item, passes) {
    if (passes) {
      results.push(item);
    }
    completedCount++;

    if (completedCount === array.length) {
      // executes the final callback with or without a delay
      if (debounceTime > 0) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          finalCallback(results);
        }, debounceTime);
      } else {
        finalCallback(results);
      }
    }
  }

  array.forEach((item) => {
    // initiates an asynchronous check for each element
    asyncPredicate(item, (predicateResult) => {
      handleCompletion(item, predicateResult);
    });
  });
}

function demoAsyncFilter() {
  const numbers = [1, 2, 3, 4, 5];

  console.log("Starting asyncFilter with debounce: ");
  asyncFilter(
    numbers,
    (num, done) => {
      console.log(`Processing (debounce): ${num}`);
      simulateAsync(num, 300, done);
    },
    (results) => {
      console.log("asyncFilter results (with debounce):", results);
    },
    500 // Debounce 500ms
  );

  console.log("Starting asyncFilter without debounce: ");
  asyncFilter(
    numbers,
    (num, done) => {
      console.log(`Processing (no debounce): ${num}`);
      simulateAsync(num, 100, done);
    },
    (results) => {
      console.log("asyncFilter results (without debounce):", results);
    }
  );
}
// demonstrates how the asynchronous filter works
demoAsyncFilter();
