import { setBg } from "./format.js";
import { getPokeindicators } from "./data.js"

document.addEventListener("DOMContentLoaded", init, false); // init once loaded

var searchInput = undefined;
var searchWordplay = undefined;
var searchKind = undefined;
var pokecryptic = new Set();

const INDICATOR_FILTER = "filter-indicator"
const WORDPLAY_FILTER = "wordplay-filter"
const KIND_FILTER = "kind-filter"

//this function appends the json data to the table 'dataTable'
function appendJson(data) {
    var table = document.getElementById('dataTable');
    var i = 0;
    var wordplays = new Set();
    var kinds = new Set();
    data.forEach(function(object) {
        var tr = document.createElement('tr');
        setBg(tr, i);
        i += 1;
        tr.setAttribute(INDICATOR_FILTER, object.indicator);
        tr.setAttribute(KIND_FILTER, object.kind);
        tr.setAttribute(WORDPLAY_FILTER, object.wordplay);
        wordplays.add(object.wordplay);
        kinds.add(object.kind);
        tr.innerHTML = '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + object.display + '</td>' +
        '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + object.indicator + '</td>' +
        '<td scope="row" class="px-6 py-4">' + object.wordplay + '</td>' +
        '<td scope="row" class="px-6 py-4">' + object.kind + '</td>';
        table.tBodies[0].appendChild(tr);
    });
    var wordplays = [...wordplays];
    wordplays.sort();
    var wordplayHtml = "";
    for (var i = 0; i < wordplays.length; i++) {
        wordplayHtml += '<option value="' + wordplays[i] + '">' + wordplays[i] + "</option>";
    }
    searchWordplay.innerHTML += wordplayHtml;

    var kinds = [...kinds];
    kinds.sort();
    var kindHtml = "";
    for (var i = 0; i < kinds.length; i++) {
        kindHtml += '<option value="' + kinds[i] + '">' + kinds[i] + "</option>";
    }
    searchKind.innerHTML += kindHtml;

    filterTable();
}

function filterTable() {
    const tableRows = document.querySelectorAll('#dataTable tbody tr');
    const filterValue = searchInput.value.toLowerCase();
    const kindValue = searchKind.value.toLowerCase();
    const wordplayValue = searchWordplay.value.toLowerCase();
    var regex = undefined;
    try {
        if (filterValue) {
            regex = new RegExp(filterValue, "i");
        }
    } catch (error) {
        // ignore
    }

    var i = 0;
    tableRows.forEach(row => {
        // Get all text content within the row cells
        const rowName = row.getAttribute(INDICATOR_FILTER).toLowerCase();
        const rowKind = row.getAttribute(KIND_FILTER).toLowerCase();
        const rowWordplay = row.getAttribute(WORDPLAY_FILTER).toLowerCase();
        
        // If the row contains the search term, display it; otherwise, hide it
        if ((!regex || regex.test(rowName)) && (kindValue == "any" || kindValue == rowKind) && (wordplayValue == "any" || wordplayValue == rowWordplay)) {
            row.style.display = '';
            setBg(row, i);
            i += 1;
        } else {
            row.style.display = 'none';
        }
    });
}

async function init() {
    searchInput = document.getElementById("searchInput");
    searchWordplay = document.getElementById("searchWordplay");
    searchKind = document.getElementById("searchKind");

    await getPokeindicators(appendJson);

    searchInput.addEventListener("input", filterTable);
    searchWordplay.addEventListener("change", (event) => { filterTable() });
    searchKind.addEventListener("change", (event) => { filterTable() });
}
