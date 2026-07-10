import { setBg } from "./format.js";
import { getJsonData, getPokecryptic } from "./data.js"

document.addEventListener("DOMContentLoaded", init, false); // init once loaded

const BANK_FILTER = "bank-filter"
const KIND_FILTER = "kind-filter"
const REPEAT_FILTER = "repeat-filter"

var pokecryptic = new Set();

function bank(s) {
    return [...new Set(s)].sort().join("");
}

function contains(a, b) {
    for (var i = 0; i < b.length; i++) {
        if (! a.includes(b[i])) {
            return false;
        }
    }
    return true;
}

//this function appends the json data to the table 'dataTable'
function filterTable() {
    const tableRows = document.querySelectorAll('#dataTable tbody tr');

    var searchInput = document.getElementById("searchInput");
    var searchKind = document.getElementById("searchKind");
    var searchRepeat = document.getElementById("searchRepeat");

    const filterValue = bank(searchInput.value.toLowerCase());
    const kindValue = searchKind.value.toLowerCase();
    const repeatValue = parseInt(searchRepeat.value);

    var i = 0;
    tableRows.forEach(row => {
        // Get all text content within the row cells
        const rowBank = row.getAttribute(BANK_FILTER).toLowerCase();
        const rowKind = row.getAttribute(KIND_FILTER).toLowerCase();
        const rowRepeats = parseInt(row.getAttribute(REPEAT_FILTER).toLowerCase());
        
        // If the row contains the search term, display it; otherwise, hide it
        if (rowRepeats >= repeatValue && contains(rowBank, filterValue) && (kindValue == "any" || kindValue == rowKind)) {
            row.style.display = '';
            setBg(row, i);
            i += 1;
        } else {
            row.style.display = 'none';
        }
    });
}

//this function is in the event listener and will execute on page load
function appendJson(data) {
    data.sort((a, b) => {
        var ab = bank(a.name);
        var bb = bank(b.name);
        if (ab.length == bb.length) {
            return ab.localeCompare(bb);
        } else {
            return ab.length - bb.length;
        }
    });
    var table = document.getElementById('dataTable');
    var i = 0;
    var maxRepeats = 0;
    data.forEach(function(object) {
        var tr = document.createElement('tr');
        setBg(tr, i);
        i += 1;
        const b = bank(object.name);
        console.log(b);
        const repeats = object.name.length - b.length;
        if (repeats > maxRepeats) {
            maxRepeats = repeats;
        }
        tr.setAttribute(BANK_FILTER, b);
        tr.setAttribute(KIND_FILTER, object.kind);
        tr.setAttribute(REPEAT_FILTER, repeats.toString());
        const used = pokecryptic.has(object.name) ? "Used" : "";
        tr.innerHTML = '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + b + '</td>' +
        '<td scope="row" class="px-6 py-4">' + object.display + '</td>' +
        '<td scope="row" class="px-6 py-4">' + object.kind + '</td>' +
        '<td scope="row" class="px-6 py-4">' + repeats.toString() + '</td>' +
        '<td class="px-6 py-4">' + used + '</td>';
        table.tBodies[0].appendChild(tr);
    });
    var searchRepeats = document.getElementById('searchRepeat');
    var html = "";
    for (var i = 0; i <= maxRepeats ; i++) {
        html += '<option value="' + i.toString() + '">' + i + "+</option>";
    }
    searchRepeats.innerHTML = html;
    searchRepeats.value = "3"; // default

    filterTable();
}

function populatePokecryptic(answers) {
    for (var i = 0; i < answers.length; i++) {
        pokecryptic.add(answers[i]);
    }
}

async function init() {
    await getPokecryptic(populatePokecryptic);
    getJsonData(appendJson);

    var searchInput = document.getElementById("searchInput");
    var searchKind = document.getElementById("searchKind");
    var searchRepeat = document.getElementById("searchRepeat");

    searchInput.addEventListener("input", filterTable);
    searchKind.addEventListener("change", (event) => { filterTable() });
    searchRepeat.addEventListener("change", (event) => { filterTable() });
}
