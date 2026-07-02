import { setBg } from "./format.js";

document.addEventListener("DOMContentLoaded", init, false); // init once loaded

var data = new Map(); // Sorted letters -> words

function updateKind() {
    const tableRows = document.querySelectorAll('#table tbody tr');
    var kind = document.getElementById("kind");
    const kindValue = kind.value.toLowerCase();

    var i = 0;
    tableRows.forEach(row => {
        // Get all text content within the row cells
        const rowKind = row.getAttribute("filter-kind").toLowerCase();
        
        // If the row contains the search term, display it; otherwise, hide it
        if ((kindValue == "any" || kindValue == rowKind)) {
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
                if (kindValue == "any" || kindValue == value.kind) {
                    rows.push({
                        display: value.display,
                        remainder: remainder,
                        kind: value.kind,
                    });
                }
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
        setBg(tr, i);
        tr.innerHTML = '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + object.display + '</td>' +
        '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + object.remainder + '</td>' +
        '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + object.kind+ '</td>';
        table.tBodies[0].appendChild(tr);
    }
}

//this function is in the event listener and will execute on page load
function getJsonData(){
    // Relative URL of external json file
    var jsonUrl = "data/data.json";

    //Build the XMLHttpRequest (aka AJAX Request)
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() { 
        if (this.readyState == 4 && this.status == 200) {//when a good response is given do this

            var rawData = JSON.parse(this.responseText); // convert the response to a json object
            for (var i = 0; i < rawData.length; i++) {
                const entry = rawData[i];
                const key = entry.name.split("").sort().join("");
                var entries = data.get(key) || [];
                entries.push({ name: entry.name, display: entry.display, kind: entry.kind });
                data.set(key, entries);
            }
        }
    }
    xmlhttp.open("GET", jsonUrl, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(); // when the request completes it will execute the code in onreadystatechange section
}

function init() {
    getJsonData();
    
    const button = document.getElementById("submit");
    button.addEventListener("click", anagram);

    const kind = document.getElementById("kind");
    kind.addEventListener("change", (event) => { updateKind() });
}
