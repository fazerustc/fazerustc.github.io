import { setBg } from "./format.js";
import { getJsonData, getPokecryptic } from "./data.js"

document.addEventListener("DOMContentLoaded", init, false); // init once loaded

//this function appends the json data to the table 'table'
function spoiler() {
    var table = document.getElementById("table");
    var input = document.getElementById("spoilerText");
    if (!input.value) {
        return;
    }

    const words = input.value.trim().split(" ");

    const per_letter = words.map(word => word.split('').map(ch => `||${ch}||`).join('')).join(" ");
    const per_letter_mono = words.map(word => word.split('').map(ch => `||\`${ch}\`||`).join('')).join(" ");
    const whole = `||${input.value}||`;
    const whole_mono = `||\`${input.value}\`||`;

    const rows = [
        ["Per letter", per_letter],
        ["Per letter mono", per_letter_mono],
        ["Whole", whole],
        ["Whole mono", whole_mono],
    ]

    table.tBodies[0].innerHTML = "";
    for (var i = 0; i < rows.length; i++) {
        const row = rows[i];
        var tr = document.createElement('tr');
        var button = document.createElement('button');
        button.textContent = "Copy Text";
        button.classList.add("copy-btn", "px-6", "py-4", "font-medium", "text-heading", "whitespace-nowrap");
        button.addEventListener("click", function(event) {
            navigator.clipboard.writeText(document.getElementById(row[0]).innerText);
            const allButtons = document.querySelectorAll('table .copy-btn');
            allButtons.forEach(btn => {
                btn.textContent = 'Copy Text';
            });
            event.currentTarget.textContent = 'Copied! ✅';
        });
        setBg(tr, i);
        tr.innerHTML = '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">' + row[0] + '</td>' +
        '<td scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap" id="' + row[0] + '">' + row[1] + '</td>';

        const buttonCell = document.createElement("td");
        buttonCell.appendChild(button);
        tr.appendChild(buttonCell);
        table.tBodies[0].appendChild(tr);
    }
}

async function init() {
    const textBox = document.getElementById("spoilerText");
    textBox.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) { // Enter
            spoiler();
        }
    });
    
    const button = document.getElementById("submit");
    button.addEventListener("click", spoiler);
}
