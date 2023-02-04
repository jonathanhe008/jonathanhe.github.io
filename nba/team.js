export async function fetchSeasonAverage(players) {
    var totals_map = {
        "pts": {},
        "ast": {},
        "reb": {},
        "blk": {},
        "stl": {},
        "turnover": {}
    };

    const playerIds = players.map(player => player['apiId']);
    var url = new URL("https://www.balldontlie.io/api/v1/season_averages");
    var params = {
        'season': '2022', 
        'player_ids[]': playerIds,
    };
    url.search = new URLSearchParams(params).toString();
    let response = await fetch(url, { method: "GET" });
    let data = await response.json();

    console.log("fetchSeasonAverage => ", data);

    const player_dict = players.reduce((acc, obj) => {
        acc[obj.apiId] = obj;
        return acc;
    }, {});

    console.log("PlayerDict => ", player_dict);

    for (let averages of data.data) {
        let player = player_dict[averages['player_id']];
        var stats = ["pts", "ast", "reb", "blk", "stl", "turnover"];
        stats.forEach(function(stat) {
            totals_map[stat][`${player['firstName']} ${player['lastName']}`] = Math.ceil(averages[stat] * averages['games_played']);
        });
    }

    console.log("team_totals_map => ", totals_map);
    return totals_map;
    
}