import { setBg } from "./format.js";
import { getSynonyms } from "./data.js"

document.addEventListener("DOMContentLoaded", init, false); // init once loaded

var searchInput = undefined;
var searchKind = undefined;
var pokecryptic = new Set();

const FILTER = "filter-key"

//this function appends the json data to the table 'dataTable'
function appendJson(data) {
    var table = document.getElementById('dataTable');
    var i = 0;
    data.forEach(function(object) {
        var tr = document.createElement('tr');
        setBg(tr, i);
        i += 1;
        tr.setAttribute(FILTER, object.key);
        tr.innerHTML = '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + object.left + '</td>' +
        '<td scope="row" class="px-6 py-4">' + object.right + '</td>' +
        '<td scope="row" class="px-6 py-4">' + object.notes + '</td>';
        table.tBodies[0].appendChild(tr);
    });
    filterTable();
}

function filterTable() {
    const tableRows = document.querySelectorAll('#dataTable tbody tr');
    const filterValue = searchInput.value.toLowerCase();
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
        const rowKey = row.getAttribute(FILTER).toLowerCase();
        
        // If the row contains the search term, display it; otherwise, hide it
        if ((!regex || regex.test(rowKey))) {
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

    await getSynonyms(appendJson);

    searchInput.addEventListener("input", filterTable);
}
