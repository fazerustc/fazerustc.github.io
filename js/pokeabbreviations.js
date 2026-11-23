import { setBg } from "./format.js";
import { getPokeabbreviations } from "./data.js"

document.addEventListener("DOMContentLoaded", init, false); // init once loaded

var searchAbbreviation = undefined;
var searchText = undefined;
var searchAcceptability = undefined;

const ABBREVIATION_FILTER = "filter-abbreviation"
const TEXT_FILTER = "text-filter"
const ACCEPTABILITY_FILTER = "acceptability-filter"

//this function appends the json data to the table 'dataTable'
function appendJson(data) {
    var table = document.getElementById('dataTable');
    var i = 0;
    var acceptabilities = new Set();
    data.forEach(function(object) {
        var tr = document.createElement('tr');
        setBg(tr, i);
        i += 1;
        tr.setAttribute(ABBREVIATION_FILTER, object.abbreviation);
        tr.setAttribute(TEXT_FILTER, object.text);
        tr.setAttribute(ACCEPTABILITY_FILTER, object.acceptability.toString());
        acceptabilities.add(object.acceptability);
        tr.innerHTML = '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + object.abbreviation + '</td>' +
        '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + object.text + '</td>' +
        '<td scope="row" class="px-6 py-4">' + object.acceptability + '</td>' +
        '<td scope="row" class="px-6 py-4">' + object.justification  + '</td>';
        table.tBodies[0].appendChild(tr);
    });
    var acceptabilities = [...acceptabilities];
    acceptabilities.sort();
    var acceptabilityHtml = "";
    for (var i = 0; i < acceptabilities.length; i++) {
        acceptabilityHtml += '<option value="' + acceptabilities[i] + '">' + acceptabilities[i] + "</option>";
    }
    searchAcceptability.innerHTML += acceptabilityHtml;

    filterTable();
}

function filterTable() {
    const tableRows = document.querySelectorAll('#dataTable tbody tr');
    const abbreviationValue = searchAbbreviation.value.toLowerCase();
    const textValue = searchText.value.toLowerCase();
    const acceptabilityValue = searchAcceptability.value.toLowerCase();
    var abbreviationRegex = undefined;
    try {
        if (abbreviationValue) {
            abbreviationRegex = new RegExp(abbreviationValue, "i");
        }
    } catch (error) {
        // ignore
    }

    var textRegex = undefined;
    try {
        if (textValue) {
            textRegex = new RegExp(textValue, "i");
        }
    } catch (error) {
        // ignore
    }

    var i = 0;
    tableRows.forEach(row => {
        // Get all text content within the row cells
        const rowAbbreviation = row.getAttribute(ABBREVIATION_FILTER).toLowerCase();
        const rowText = row.getAttribute(TEXT_FILTER).toLowerCase();
        const rowAcceptability = row.getAttribute(ACCEPTABILITY_FILTER).toLowerCase();
        
        // If the row contains the search term, display it; otherwise, hide it
        if ((!abbreviationRegex || abbreviationRegex.test(rowAbbreviation)) && (!textRegex || textRegex.test(rowText)) && (acceptabilityValue == "any" || acceptabilityValue == rowAcceptability)) {
            row.style.display = '';
            setBg(row, i);
            i += 1;
        } else {
            row.style.display = 'none';
        }
    });
}

async function init() {
    searchAbbreviation = document.getElementById("searchAbbreviation");
    searchText = document.getElementById("searchText");
    searchAcceptability = document.getElementById("searchAcceptability");

    await getPokeabbreviations(appendJson);

    searchAbbreviation.addEventListener("input", filterTable);
    searchText.addEventListener("change", (event) => { filterTable() });
    searchAcceptability.addEventListener("change", (event) => { filterTable() });
}
