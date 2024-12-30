function simulateAsync(value, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value > 2);
    }, delay);
  });
}
