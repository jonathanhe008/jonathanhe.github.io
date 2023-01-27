export async function fetchStats(player) {
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
    let point_map = {};
    for (let d of data.data) {
        if (d.min === "00" || d.min === "" || d.min === "0" || d.min === "0:00") {
            continue;
        }
        if (point_map[d.pts]) {
            point_map[d.pts]++;
        } else {
            point_map[d.pts] = 1;
        }
    }

    let result = [];
    for (const [key, value] of Object.entries(point_map)) {
        result.push({
            point: key,
            count: value
        })
    }

    console.log(result);
    return result;
}
