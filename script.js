document.addEventListener("DOMContentLoaded", () => {
  const yearNode = document.getElementById("year");

  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
});
