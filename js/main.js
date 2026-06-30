document.addEventListener("DOMContentLoaded", init, false); // init once loaded

var searchInput = undefined;
var searchType = undefined;
const BGS = ["bg-slate-100", "bg-gray-200"];

function init() {
    getJsonData();

    searchInput = document.getElementById('searchInput');
    searchType = document.getElementById("searchType");

    searchInput.addEventListener('input', filterTable);
    searchType.addEventListener('change', (event) => { filterTable() });
}

//this function is in the event listener and will execute on page load
function getJsonData(){
    // Relative URL of external json file
    var jsonUrl = 'data/data.json';

    //Build the XMLHttpRequest (aka AJAX Request)
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() { 
        if (this.readyState == 4 && this.status == 200) {//when a good response is given do this

            var data = JSON.parse(this.responseText); // convert the response to a json object
            appendJson(data);// pass the json object to the appendJson function
        }
    }
    //set the request destination and type
    xmlhttp.open("POST", jsonUrl, true);
    //set required headers for the request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // send the request
    xmlhttp.send(); // when the request completes it will execute the code in onreadystatechange section
}

//this function appends the json data to the table 'gable'
function appendJson(data){
    var table = document.getElementById('dataTable');
    var i = 0;
    data.forEach(function(object) {
        var tr = document.createElement('tr');
        tr.classList.add(BGS[i % BGS.length]);
        i += 1;
        tr.setAttribute("filter-name", object.name);
        tr.setAttribute("filter-type", object.type);
        tr.innerHTML = '<th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap><a href="' + object.url + '">' + object.display + '</a></th>' +
        '<td scope="row" class="px-6 py-4">' + object.type + '</td>';
        table.tBodies[0].appendChild(tr);
    });
}

function filterTable() {
    console.log("Filtering");
    const tableRows = document.querySelectorAll('#dataTable tbody tr');
    const filterValue = searchInput.value.toLowerCase();
    const typeValue = searchType.value.toLowerCase();
    var regex = undefined;
    try {
        if (filterValue) {
            console.log('"' + filterValue + '"');
            regex = new RegExp(filterValue, "i");
        }
    } catch (error) {
        // ignore
    }

    var i = 0;
    tableRows.forEach(row => {
        // Get all text content within the row cells
        const rowName = row.getAttribute("filter-name").toLowerCase();
        const rowType = row.getAttribute("filter-type").toLowerCase();
        for (var j = 0; j < BGS.length; j++) {
            row.classList.remove(BGS[j]);
        }
        row.classList.add(BGS[i % BGS.length]);
        i += 1;
        
        // If the row contains the search term, display it; otherwise, hide it
        if ((!regex || regex.test(rowName)) && (typeValue == "any" || typeValue == rowType)) {
            console.log(rowName + " matches " + filterValue);
            row.style.display = '';
        } else {
            console.log(rowName + " does not match " + filterValue + " " + typeValue);
            row.style.display = 'none';
        }
    });
}