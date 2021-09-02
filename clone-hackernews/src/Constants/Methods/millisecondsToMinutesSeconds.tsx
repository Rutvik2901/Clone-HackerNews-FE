export const millisToMinutesAndSeconds = (millis: number) => {
  const hours = Math.floor(millis / 3600000);
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return hours > 0 ? hours : minutes > 0 ? minutes : (parseInt(seconds) < 10 ? "0" : "") + seconds;
};

export const getLabelBasedOnTime = (millis: number) => {
  return millis > 3600000 ? "hours" : millis > 60000 ? "minutes" : "seconds";
};
