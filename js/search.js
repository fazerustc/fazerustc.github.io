import { setBg } from "./format.js";
import { getJsonData, getPokecryptic } from "./data.js"

document.addEventListener("DOMContentLoaded", init, false); // init once loaded

var searchInput = undefined;
var searchKind = undefined;
var searchUsed = undefined;
var pokecryptic = new Set();

//this function appends the json data to the table 'dataTable'
function appendJson(data) {
    var table = document.getElementById('dataTable');
    var i = 0;
    var kinds = new Set();
    data.forEach(function(object) {
        var tr = document.createElement('tr');
        setBg(tr, i);
        i += 1;
        tr.setAttribute("filter-name", object.name);
        tr.setAttribute("filter-kind", object.kind);
        const used = pokecryptic.has(object.name) ? "Used" : "";
        const usedFilter = used == "Used" ? "used" : "unused";
        tr.setAttribute("filter-used", usedFilter);
        kinds.add(object.kind);
        tr.innerHTML = '<th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap><a href="' + object.url + '">' + object.display + '</a></th>' +
        '<td scope="row" class="px-6 py-4">' + object.kind+ '</td>' +
        '<td class="px-6 py-4">' + used + '</td>';
        table.tBodies[0].appendChild(tr);
    });

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
    const usedValue = searchUsed.value.toLowerCase();
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
        const rowName = row.getAttribute("filter-name").toLowerCase();
        const rowKind = row.getAttribute("filter-kind").toLowerCase();
        const rowUsed = row.getAttribute("filter-used");
        
        // If the row contains the search term, display it; otherwise, hide it
        if ((!regex || regex.test(rowName)) && (kindValue == "any" || kindValue == rowKind) && (usedValue == "any" || usedValue == rowUsed)) {
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
    await getPokecryptic(populatePokecryptic);
    getJsonData(appendJson);

    searchInput = document.getElementById("searchInput");
    searchKind = document.getElementById("searchKind");
    searchUsed = document.getElementById("searchUsed");

    searchInput.addEventListener("input", filterTable);
    searchKind.addEventListener("change", (event) => { filterTable() });
    searchUsed.addEventListener("change", (event) => { filterTable() });
}
