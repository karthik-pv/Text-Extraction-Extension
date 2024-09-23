function downloadDataStringAsTxt() {
  chrome.storage.local.get("dataString", (result) => {
    const dataString = result.dataString;
    if (!dataString) {
      alert("No data found in local storage.");
      return;
    }

    const blob = new Blob([dataString], { type: "text/plain" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dataString.txt";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  });
}

downloadDataStringAsTxt();
