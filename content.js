console.log("Content script executed");

function collectVisibleTextOnScreen() {
  let visibleDataString = "";
  const seenTexts = new Set();

  function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  const allElements = document.querySelectorAll("*");

  allElements.forEach((element) => {
    const computedStyle = window.getComputedStyle(element);
    if (
      computedStyle.display !== "none" &&
      computedStyle.visibility !== "hidden" &&
      element.innerText !== "" &&
      !["SCRIPT", "STYLE"].includes(element.tagName) &&
      isElementInViewport(element) &&
      !element.hasAttribute("style") &&
      !element.className
    ) {
      const cleanText = element.innerText.replace(/\s+/g, " ").trim();
      if (cleanText && !seenTexts.has(cleanText)) {
        visibleDataString += cleanText + "\n";
        seenTexts.add(cleanText);
        console.log("Visible text: ", cleanText);
      }
    }
  });

  chrome.runtime.sendMessage({
    action: "copyToClipboard",
    text: visibleDataString,
  });

  alert(visibleDataString);
  chrome.storage.local.set({ dataString: visibleDataString }, () => {
    console.log("Updated dataString stored in chrome.storage.local");
  });
  visibleDataString = "";
}

collectVisibleTextOnScreen();
