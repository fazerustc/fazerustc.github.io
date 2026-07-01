const BGS = ["bg-slate-100", "bg-gray-200"];

export function setBg(elem, i) {
    for (var j = 0; j < BGS.length; j++) {
        elem.classList.remove(BGS[j]);
    }
    elem.classList.add(BGS[i % BGS.length]);
}