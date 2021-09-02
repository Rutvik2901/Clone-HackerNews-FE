export const millisToHoursAndMinutesAndSeconds = (millis: number) => {
  const hours = Math.floor(millis / 3600000);
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return hours > 0 ? hours + " hours" : minutes > 0 ? minutes + " minutes" : (parseInt(seconds) < 10 ? "0" : "") + seconds + " seconds";
};
