export async function fetchSeasonAverage(players) {
    var totals_map = {
        "pts": {},
        "ast": {},
        "reb": {},
        "blk": {},
        "stl": {},
        "turnover": {},
        "min": {}
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
    data.data.sort((a, b) => b.pts - a.pts)

    const player_dict = players.reduce((acc, obj) => {
        acc[obj.apiId] = obj;
        return acc;
    }, {});

    console.log("PlayerDict => ", player_dict);

    var table = "<table class='table'>" +
            "<thead>" +
            "<tr>" +
            "<th>Player</th>" +
            "<th>Pts</th>" +
            "<th>Ast</th>" +
            "<th>Reb</th>" +
            "<th>Stl</th>" +
            "<th>Blk</th>" +
            "<th>Tov</th>" +
            "<th>Min</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody>";

    for (let averages of data.data) {
        let player = player_dict[averages['player_id']];
        var stats = ["pts", "ast", "reb", "blk", "stl", "turnover", "min"];
        stats.forEach(function(stat) {
            if (stat == "min") {
                const parts = averages[stat].split(":");
                const minutes = parseInt(parts[0])+ (parseInt(parts[1])/60);
                totals_map[stat][`${player['firstName']} ${player['lastName']}`] = Math.ceil(minutes * averages['games_played']);
            } else {
                totals_map[stat][`${player['firstName']} ${player['lastName']}`] = Math.ceil(averages[stat] * averages['games_played']);
            }
        });

        table += "<tr>" +
             "<td> <img src=\"" + `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player['personId']}.png` + "\" class=\"img-fluid headshot-max-size\"></img> " 
             + `${player['firstName']} ${player['lastName']}` + "</td>" +
             "<td>" + totals_map['pts'][`${player['firstName']} ${player['lastName']}`] + "</td>" +
             "<td>" + totals_map['ast'][`${player['firstName']} ${player['lastName']}`] + "</td>" +
             "<td>" + totals_map['reb'][`${player['firstName']} ${player['lastName']}`] + "</td>" +
             "<td>" + totals_map['stl'][`${player['firstName']} ${player['lastName']}`] + "</td>" +
             "<td>" + totals_map['blk'][`${player['firstName']} ${player['lastName']}`] + "</td>" +
             "<td>" + totals_map['turnover'][`${player['firstName']} ${player['lastName']}`]+ "</td>" +
             "<td>" + new Intl.NumberFormat().format(totals_map['min'][`${player['firstName']} ${player['lastName']}`]) + "</td>" +
             "</tr>";
    }

    table += "</tbody>" +
         "</table>";
    document.getElementById("table_container").innerHTML = table;
    console.log("team_totals_map => ", totals_map);
    return totals_map;
    
}