import { setBg } from "./format.js";

document.addEventListener("DOMContentLoaded", init, false); // init once loaded

var data = new Map(); // Sorted letters -> words

//this function appends the json data to the table 'dataTable'
function anagram() {
    var table = document.getElementById("table");
    var input = document.getElementById("anagramText");

    const letters = input.value.toLowerCase().split("").sort().join("");

    var rows = [];
    var logged = false;
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
            console.log(letters, key);
            console.log(values);
            for (var i = 0; i < values.length; i++) {
                const value = values[i];
                rows.push({
                    display: value.display,
                    remainder: remainder,
                })
            }
        }
    });
    console.log(rows);
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
        console.log(object);
        var tr = document.createElement('tr');
        setBg(tr, i);
        tr.innerHTML = '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + object.display + '</td>' +
        '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + object.remainder + '</td>';
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
            var seen = new Set();
            for (var i = 0; i < rawData.length; i++) {
                const entry = rawData[i];
                if (seen.has(entry.display)) {
                    continue;
                }
                seen.add(entry.display);
                const key = entry.name.split("").sort().join("");
                var entries = data.get(key) || [];
                entries.push({ name: entry.name, display: entry.display });
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
}
