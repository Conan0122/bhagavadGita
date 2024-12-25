document.getElementById("toggle-widget").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "toggle-widget" });
  });
});



// Listen for background selection change
document.getElementById("bg-selector").addEventListener("change", (event) => {
  const selectedBg = event.target.value;

  // Send the selected background to content.js
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "change-bg", background: selectedBg });
  });
});
