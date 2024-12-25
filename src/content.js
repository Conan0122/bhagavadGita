(async function () {
  // Check if the widget already exists
  if (document.getElementById("floating-quote-widget")) {
    return;
  }

  // Fetch the JSON file from the extension's resources
  async function fetchQuotes() {
    try {
      const response = await fetch(chrome.runtime.getURL("src/Gita.json"));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error loading quotes:", error);
      return [];
    }
  }

  // Get a random quote
  async function getRandomQuote() {
    const quotes = await fetchQuotes();
    if (quotes.length === 0) {
      return {
        chapter: "Unknown",
        verse: "Unknown",
        quote: "Could not load a quote.",
        author: "Unknown",
      };
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  // Define gradient background variables
  const traditionalBG = "linear-gradient(135deg, #6A1C1C, #8B2500, #4A1C3C)";
  const blackBG = "linear-gradient(135deg, #000000, #434343, #2f2f2f)";
  const nightSkyBG = "linear-gradient(135deg, #1f3b4d, #2a4d6e, #344b7a)";

  // Store the selected background
  let selectedBackground = traditionalBG; // Default background

  // Create the widget
  const widget = document.createElement("div");
  widget.id = "floating-quote-widget";
  widget.style.cssText = `
      position: fixed;
      bottom: 16px;
      left: 50%;
      padding: 20px 30px;
      background: ${selectedBackground};
      color: white;
      border: 2px solid gold;
      border-radius: 15px;
      font-size: 18px;
      font-family: 'Playfair Display', serif;
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.6);
      z-index: 9999;
      transform: translateX(-50%);
      max-width: 80%;
      min-width: 300px;
      word-wrap: break-word;
      text-align: center;
      cursor: pointer;
      transition: all 0.7s ease;
    `;

  // Display the random quote in the widget
  const verseData = await getRandomQuote();
  widget.innerHTML = `
      <strong>Chapter ${verseData.chapter}, Verse ${verseData.verse}</strong>
      <p style="margin-top: 8px; font-style: italic;">"${verseData.quote}"</p>
      <span style="display: block; margin-top: 10px; font-size: 14px; color: #FFD700;">- ${verseData.author}</span>
  `;

  document.body.appendChild(widget);

  // Toggle visibility using z-index
  widget.addEventListener("click", () => {
    if (widget.style.zIndex === "-9999") {
      widget.style.opacity = "1";
      widget.style.zIndex = "9999"; // Show the widget
    } else {
      widget.style.opacity = "0";
      widget.style.zIndex = "-9999"; // Hide the widget
    }
  });

  // Add toggle functionality through chrome messaging
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggle-widget") {
      if (widget.style.zIndex === "-9999") {
        widget.style.opacity = "1";
        widget.style.zIndex = "9999"; // Show the widget
      } else {
        widget.style.opacity = "0";
        widget.style.zIndex = "-9999"; // Hide the widget
      }
    }

    if (message.action === "change-bg") {
      // Change the background based on user selection
      switch (message.background) {
        case "traditionalBG":
          selectedBackground = traditionalBG;
          break;
        case "blackBG":
          selectedBackground = blackBG;
          break;
        case "nightSkyBG":
          selectedBackground = nightSkyBG;
          break;
        default:
          selectedBackground = traditionalBG;
      }

      // Update the widget's background
      widget.style.background = selectedBackground;
    }
  });
})();
