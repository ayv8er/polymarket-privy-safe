export const createPollingInterval = (
  callback: () => void,
  interval: number,
  duration: number
) => {
  const pollInterval = setInterval(callback, interval);
  setTimeout(() => clearInterval(pollInterval), duration);
  return pollInterval;
};
