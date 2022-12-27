function createPromise(value) {
  return new Promise((resolve) => {
    resolve(value);
  });
}
module.exports = createPromise;
