export async function getJsonData(callback) {
    await getJson("data/data.json", callback);
}

export async function getPokecryptic(callback) {
    await getJson("https://www.pokecryptic.com/data/clues.json", (data) => {
        var answers = [];
        for (var i = 0; i < data.length; i++) {
            answers.push(data[i].answer.toLowerCase().replaceAll(" ", "").replaceAll("-", ""));
        }
        callback(answers);
    });
}

async function getJson(url, callback) {
    const data = await fetch(url);
    (callback)(await data.json());
}