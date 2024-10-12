function formatTime(date) {
  const now = new Date(date);
  const month = now.toLocaleString("en-US", { month: "short" });
  const day = now.getDate();
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${month}-${day}-${year}, ${hours}:${minutes}`;
}

module.exports = formatTime;
