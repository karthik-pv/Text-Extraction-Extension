console.log("Content Script 3 executed");

function getAmazonSearchListData() {
  let dataString = "";
  const searchResults = document.querySelectorAll(
    '[data-component-type="s-search-result"]'
  );
  let counter = 1;
  searchResults.forEach((result) => {
    dataString += "PRODUCT NUMBER  - " + counter;
    dataString += "\n\n\n";
    dataString += result.innerText;
    dataString += "\n";
    dataString +=
      "-------------------------------------------------------------------------------------------------------";
    dataString += "\n";
    counter += 1;
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

getAmazonSearchListData();
