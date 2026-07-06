import { setBg } from "./format.js";
import { getIndicators } from "./data.js"

document.addEventListener("DOMContentLoaded", init, false); // init once loaded

var searchInput = undefined;
var searchKind = undefined;
var pokecryptic = new Set();

const INDICATOR_FILTER = "filter-indicator"
const WORDPLAY_FILTER = "wordplay-filter"

//this function appends the json data to the table 'dataTable'
function appendJson(data) {
    var table = document.getElementById('dataTable');
    var i = 0;
    var wordplays = new Set();
    data.forEach(function(object) {
        var tr = document.createElement('tr');
        setBg(tr, i);
        i += 1;
        tr.setAttribute(INDICATOR_FILTER, object.indicator);
        tr.setAttribute(WORDPLAY_FILTER, object.wordplay);
        wordplays.add(object.wordplay);
        tr.innerHTML = '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + object.indicator + '</td>' +
        '<td scope="row" class="px-6 py-4">' + object.wordplay + '</td>';
        table.tBodies[0].appendChild(tr);
    });
    var wordplays = [...wordplays];
    wordplays.sort();
    var html = "";
    for (var i = 0; i < wordplays.length; i++) {
        html += '<option value="' + wordplays[i] + '">' + wordplays[i] + "</option>";
    }
    searchKind.innerHTML += html;
    filterTable();
}

function filterTable() {
    const tableRows = document.querySelectorAll('#dataTable tbody tr');
    const filterValue = searchInput.value.toLowerCase();
    const kindValue = searchKind.value.toLowerCase();
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
        const rowKind = row.getAttribute(WORDPLAY_FILTER).toLowerCase();
        
        // If the row contains the search term, display it; otherwise, hide it
        if ((!regex || regex.test(rowName)) && (kindValue == "any" || kindValue == rowKind)) {
            row.style.display = '';
            setBg(row, i);
            i += 1;
        } else {
            row.style.display = 'none';
        }
    });
}

function populatePokecryptic(answers) {
    for (var i = 0; i < answers.length; i++) {
        pokecryptic.add(answers[i]);
    }
}

async function init() {
    searchInput = document.getElementById("searchInput");
    searchKind = document.getElementById("searchKind");

    await getIndicators(appendJson);

    searchInput.addEventListener("input", filterTable);
    searchKind.addEventListener("change", (event) => { filterTable() });
}
