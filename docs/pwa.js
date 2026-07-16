// Register the service worker for offline support and installability.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      // No service worker = the site still works normally, just not offline.
    });
  });
}
