// Function to update footer dates
export function updateFooterDates() {
  const yearEl = document.getElementById("current-year");
  const modifiedEl = document.getElementById("lastModified");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (modifiedEl) {
    modifiedEl.textContent = document.lastModified;
  }
}