function fetchData(callback) {
  setTimeout(() => {
    const data = "This is the fetched data.";
    callback(data); 
  }, 2000);
}

function processData(data) {
  console.log("Processing data:", data);
}

console.log("Initiating data fetch...");
fetchData(processData); 
console.log("Continuing with other tasks...");