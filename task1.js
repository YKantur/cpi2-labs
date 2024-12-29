function simulateAsync(value, delay, callback) {
  // simulates an asynchronous operation
  setTimeout(() => {
    callback(value > 2);
  }, delay);
}
