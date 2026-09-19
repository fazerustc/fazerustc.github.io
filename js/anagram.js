import { setBg } from "./format.js";
import { getJsonData, getPokecryptic } from "./data.js"

document.addEventListener("DOMContentLoaded", init, false); // init once loaded

var data = new Map(); // Sorted letters -> words
var pokecryptic = new Set();

function updateFilter() {
    const tableRows = document.querySelectorAll('#table tbody tr');
    var kind = document.getElementById("kind");
    const kindValue = kind.value.toLowerCase();
    var used = document.getElementById("used");
    const usedValue = used.value.toLowerCase();

    var i = 0;
    tableRows.forEach(row => {
        // Get all text content within the row cells
        const rowKind = row.getAttribute("filter-kind").toLowerCase();
        const rowUsed = row.getAttribute("filter-used").toLowerCase();
        
        // If the row contains the search term, display it; otherwise, hide it
        if ((kindValue == "any" || kindValue == rowKind) && (usedValue == "any" || usedValue == rowUsed)) {
            row.style.display = '';
            setBg(row, i);
            i += 1;
        } else {
            row.style.display = 'none';
        }
    });
}

//this function appends the json data to the table 'dataTable'
function anagram() {
    var table = document.getElementById("table");
    var input = document.getElementById("anagramText");
    if (!input.value) {
        return;
    }
    const kind = document.getElementById("kind");
    const kindValue = kind.value.toLowerCase();
    const used = document.getElementById("used");
    const usedValue = kind.value.toLowerCase();

    const letters = input.value.toLowerCase().split("").sort().join("");

    var rows = [];
    data.forEach((values, key) => {
        var l = 0;
        var k = 0;
        var remainder = "";
        while (l < letters.length && k < key.length) {
            if (key[k] > letters[l]) {
                break;
            }
            if (key[k] == letters[l]) {
                l += 1;
                k += 1;
            } else {
                remainder += key[k];
                k += 1;
            }
        }
        if (l == letters.length) {
            remainder += key.substring(k, key.length);
            for (var i = 0; i < values.length; i++) {
                const value = values[i];
                rows.push({
                    name: value.name,
                    display: value.display,
                    remainder: remainder,
                    kind: value.kind,
                });
            }
        }
    });
    rows.sort((a, b) => {
        if (a.remainder.length == b.remainder.length) {
            return a.display.localeCompare(b.display);
        } else {
            return a.remainder.length - b.remainder.length;
        }
    });
    table.tBodies[0].innerHTML = "";
    for (var i = 0; i < rows.length; i++) {
        const object = rows[i];
        var tr = document.createElement('tr');
        tr.setAttribute("filter-kind", object.kind.toLowerCase());
        const used = pokecryptic.has(object.name) ? "Used" : "";
        const usedFilter = used == "Used" ? "used" : "unused";
        tr.setAttribute("filter-used", usedFilter);
        setBg(tr, i);
        tr.innerHTML = '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + object.display + '</td>' +
        '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + object.remainder + '</td>' +
        '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + object.kind+ '</td>' +
        '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + used + '</td>';
        table.tBodies[0].appendChild(tr);
    }
    updateFilter();
}

//this function is in the event listener and will execute on page load
function populateData(rawData){
    var kinds = new Set();
    for (var i = 0; i < rawData.length; i++) {
        const entry = rawData[i];
        const key = entry.name.split("").sort().join("");
        var entries = data.get(key) || [];
        entries.push({ name: entry.name, display: entry.display, kind: entry.kind });
        data.set(key, entries);
        kinds.add(entry.kind);
    }

    var kinds = [...kinds];
    kinds.sort();
    var kindHtml = "";
    for (var i = 0; i < kinds.length; i++) {
        kindHtml += '<option value="' + kinds[i] + '">' + kinds[i] + "</option>";
    }
    const kind = document.getElementById("kind");
    kind.innerHTML += kindHtml;
}

function populatePokecryptic(answers) {
    for (var i = 0; i < answers.length; i++) {
        pokecryptic.add(answers[i]);
    }
}

async function init() {
    await getPokecryptic(populatePokecryptic);
    getJsonData(populateData);

    const textBox = document.getElementById("anagramText");
    textBox.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) { // Enter
            anagram();
        }
    });
    
    const button = document.getElementById("submit");
    button.addEventListener("click", anagram);

    const kind = document.getElementById("kind");
    kind.addEventListener("change", (event) => { updateFilter() });

    const used = document.getElementById("used");
    used.addEventListener("change", (event) => { updateFilter() });
}
