export function getCoordinates() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (result) => resolve(result.coords),
        (reason) => reject(reason)
      );
    } else {
      reject("Geolocation unsupported.");
    }
  });
}
