function getRows(url) {
  // Get CSV bytes from a static URL and parse the CSV into
  // an array of Objects.
  let request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.send(null);
  csv_lines = request.response.split("\n");
  const header = csv_lines[0].split(",");
  const data = csv_lines.slice(1);
  const entries = data.map((row, i) => {
    return row.split(",").map((column, j) => [header[j], column]);
  });
  const rows = entries.map((entry) => {
    return Object.fromEntries(entry);
  });
  return rows;
}

function filterRows(rows, query) {
  // Takes in an array of unfiltered search results and a query,
  // and filters them by the query
  rows = rows.filter((row) => {
    const searchFields = [row.CITY, row.STABBR, row.INSTNM, row.INSTURL];
    if (searchFields.join(" ").includes(query)) {
      return row;
    }
  });

  return rows;
}

function renderRows(rows) {
  // Takes in an array of filtered search results
  // and renders them on the page
  const searchResults = document.getElementById("search-results");
  searchResults.innerHTML = "";
  rows.forEach((row) => {
    let searchResult = document.createElement("a");
    searchResult.href = `https://${row.INSTURL}`;
    searchResult.className = "search-result";
    searchResult.id = row.UNITID;

    let card = document.createElement("div");
    card.className = "card";

    let location = document.createElement("span");
    location.className = "location";
    location.innerHTML = `${row.CITY} • ${row.STABBR}`;
    card.appendChild(location);

    let name = document.createElement("span");
    name.className = "name";
    name.innerText = row.INSTNM;
    card.appendChild(name);

    let link = document.createElement("a");
    link.href = `https://${row.INSTURL}`;
    link.innerText = row.INSTURL;
    card.appendChild(link);
    searchResult.appendChild(card);

    searchResults.appendChild(searchResult);
  });
}

// Start Page logic
// Get data and initial page load
const data_url =
  "https://gist.githubusercontent.com/simonlast/d5a86ba0c82e1b0d9f6e3d2581b95755/raw/f608b9b896dd3339df13dae317998d5f24c00a50/edu-scorecard.csv";

var rows = getRows(data_url);
renderRows(rows);

// Filter search results by query
// If search in cache, return the cache entry instead
const searchInput = document.getElementById("search-input");
const searchCache = {};
searchInput.addEventListener("input", (event) => {
  if (!searchCache.hasOwnProperty(event.target.value)) {
    rows = filterRows(rows, event.target.value);
    searchCache[event.target.value] = rows;
  } else {
    rows = searchCache[event.target.value];
  }
  renderRows(rows);
});
