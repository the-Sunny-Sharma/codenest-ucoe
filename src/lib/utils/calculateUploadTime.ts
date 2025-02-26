export function calculateEstimatedTime(
  fileSize: number,
  uploadSpeed = 1
): string {
  // uploadSpeed in Mbps, default to 1 Mbps for conservative estimate
  const bitsToUpload = fileSize * 8;
  const secondsToUpload = bitsToUpload / (uploadSpeed * 1000000);

  if (secondsToUpload < 60) {
    return `${Math.ceil(secondsToUpload)} seconds`;
  } else if (secondsToUpload < 3600) {
    return `${Math.ceil(secondsToUpload / 60)} minutes`;
  } else {
    const hours = Math.floor(secondsToUpload / 3600);
    const minutes = Math.ceil((secondsToUpload % 3600) / 60);
    return `${hours} hours ${minutes} minutes`;
  }
}
