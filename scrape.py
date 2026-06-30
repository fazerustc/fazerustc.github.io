import argparse
from dataclasses import dataclass
import json
import re


from bs4 import BeautifulSoup as BS
import cloudscraper


POKEMON = "https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number"
ITEMS = "https://bulbapedia.bulbagarden.net/wiki/List_of_items_by_name"
MOVES = "https://bulbapedia.bulbagarden.net/wiki/List_of_moves"
ABILITIES = "https://bulbapedia.bulbagarden.net/wiki/Ability"
CHARACTERS = "https://bulbapedia.bulbagarden.net/wiki/List_of_game_characters"
ROOT = "https://bulbapedia.bulbagarden.net"


@dataclass
class Data:
    name: str
    url: str
    kind: str
    display: str

    def to_json(self) -> dict[str, str]:
        return {
            "name": self.name,
            "url": self.url,
            "kind": self.kind,
            "display": self.display,
        }


def scrape(url: str, selector, kind: str, needle, ignore: set[str]) -> list[Data]:
    scraper = cloudscraper.create_scraper()
    response = scraper.get(url)
    soup = BS(response.text, "html.parser")
    tags = (selector)(soup)
    result = {}
    parens = re.compile("\(.*\)")
    for tag in tags:
        href = tag.get("href")
        if not href:
            continue
        matches = re.match(needle, href)
        if matches:
            display = matches.group(1)
            if "#" in display:
                continue
            display = re.sub(parens, "", display)
            display = (
                display
                .replace("_", " ")
                .replace("%C3%A9", "é")
                .replace("%C3%89", "É")
                .replace("%27", "'")
                .replace("%26", "&")
                .replace("%C5%AB", "ū")
                .replace("%C5%8D", "ō")
                .replace("%C3%B1", "ñ")
                .replace("%3F", "?")
                .replace("%E2%99%80", "♂")
                .replace("%E2%99%82", "♀")
                .replace("List of unobtainable items#", "")
                .strip()
            )
            name = (
                display.replace(" ", "")
                .replace("é", "e")
                .replace("-", "")
                .replace(".", "")
                .replace(",", "")
                .replace("'", "")
                .replace("&", "")
                .replace("ū", "u")
                .replace("ō", "o")
                .replace("ñ", "n")
                .replace("?", "")
                .replace("♂", "")
                .replace("♀", "")
                .lower()
            )
            if name.startswith("file:"):
                continue
            name = name.replace(":", "")
            if name in ignore:
                continue
            if name.startswith("candy#"):
                continue
            if name.startswith("wonderlauncher#"):
                continue
            result[display] = Data(
                name=name, url=f"{ROOT}{href}", kind=kind, display=display
            )
    return list(result.values())


def main(outfile: str):
    data = []
    data += scrape(
        ABILITIES,
        lambda soup: soup.find_all("a"),
        "Ability",
        re.compile("^/wiki/(.*)_\(Ability\)$"),
        set(),
    )
    data += scrape(
        CHARACTERS,
        lambda soup: soup.select("tr td a"),
        "Character",
        re.compile("^/wiki/([^(]*)"),
        {
            "bulbapediaprojectcharacterdex",
            "bulbapediaprojects",
            "categorycharacters",
            "listofanimatedseriescharacters",
            "listofpokemonadventurescharacters",
            "listofpokemonconquestcharacters",
            "listofpokemonconquestcharacters",
            "listofpokemonmysterydungeon",
            "listofpokemonmysterydungeonexplorersoftimedarknessandskycharacters",
            "listofpokemonmysterydungeongatestoinfinitycharacters",
            "listofpokemonmysterydungeonredrescueteamandbluerescueteamcharacters",
            "listofpokemonsupermysterydungeoncharacters",
            "pokemongames",
            "pokemonmysterydungeonseries",
        },
    )
    data += scrape(
        ITEMS,
        lambda soup: [
            tr.select_one("td:nth-of-type(2)").select_one("a")
            for tr in soup.select("tr")
            if tr.select_one("td:nth-of-type(2)")
        ],
        "Item",
        re.compile("^/wiki/(.*)$"),
        {"bulbapediaprojectitemdex"},
    )
    data += scrape(
        MOVES,
        lambda soup: soup.find_all("a"),
        "Move",
        re.compile("^/wiki/(.*)_\(move\)$"),
        set(),
    )
    data += scrape(
        POKEMON,
        lambda soup: soup.find_all("a"),
        "Pokémon",
        re.compile("^/wiki/(.*)_\(Pok%C3%A9mon\)$"),
        set(),
    )
    data.sort(key=lambda d: d.name)
    with open(outfile, "w") as f:
        json.dump([d.to_json() for d in data], f, sort_keys=True, indent=2)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--outfile", default="data/data.json")
    args = parser.parse_args()
    main(args.outfile)
