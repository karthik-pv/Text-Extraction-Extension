console.log("Content script executed");

function iterateThroughHTMLElements() {
  let dataString = "";
  const processedElements = new Set();
  const seenTexts = new Set();

  document
    .querySelectorAll("script, style, nav, footer, header, aside , iframe")
    .forEach((el) => el.remove());

  const allElements = document.body.getElementsByTagName("*");

  Array.from(allElements).forEach((element) => {
    const computedStyle = window.getComputedStyle(element);
    if (
      computedStyle.display !== "none" &&
      computedStyle.visibility !== "hidden" &&
      element.innerText !== "" &&
      !["SCRIPT", "STYLE", "IFRAME"].includes(element.tagName) &&
      element.tagName.indexOf("-") === -1 &&
      !element.hasAttribute("style") &&
      !element.className
    ) {
      const cleanText = element.innerText;
      if (cleanText && !seenTexts.has(cleanText)) {
        dataString += cleanText + "\n";
        seenTexts.add(cleanText);

        console.log(cleanText);

        let parentElement = element;
        while (parentElement) {
          processedElements.add(parentElement);
          parentElement = parentElement.parentElement;
        }
      }
    }
  });
  chrome.runtime.sendMessage({
    action: "copyToClipboard",
    text: dataString,
  });
  alert(dataString);
  chrome.storage.local.set({ dataString }, () => {
    console.log("Updated dataString stored in chrome.storage.local");
  });
  dataString = "";
}

iterateThroughHTMLElements();
