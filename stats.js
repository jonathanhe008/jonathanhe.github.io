export async function fetchStats(player, stat) {
    var stat_literal = {
        "Points": "pts",
        "Assists": "ast",
        "Rebounds": "reb",
        "Blocks": "blk",
        "Steals": "stl",
        "Turnovers": "turnover",
    };

    var player_id = player ? player['id'] : 237;
    var url = new URL("https://www.balldontlie.io/api/v1/stats");
    var params = {
        'seasons[]': ['2022'], 
        'player_ids[]': [player_id],
        'per_page': 100
    };
    url.search = new URLSearchParams(params).toString();
    let response = await fetch(url, { method: "GET" });
    let data = await response.json();

    if (data.data.length == 0) {
        alert("Player didn't play this season!! Please narrow down search");
    }
    console.log(data.data);
    // let sorted_data = data.data.sort((a, b) => {
    //     return new Date(a.game.date) - new Date(b.game.date);
    // });
    console.log(stat_literal[stat]);
    const stat_name = stat_literal[stat];
    let stat_map = {};
    for (let d of data.data) {
        if (d.min === "00" || d.min === "" || d.min === "0" || d.min === "0:00") {
            continue;
        }
        let stat = d[stat_name];
        if (stat_map[stat]) {
            stat_map[stat]++;
        } else {
            stat_map[stat] = 1;
        }
    }

    let result = [];
    for (const [key, value] of Object.entries(stat_map)) {
        result.push({
            stat: key,
            count: value
        })
    }

    console.log(result);
    return result;
}
