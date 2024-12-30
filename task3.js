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
