export async function fetchStats(player, stat, team_map) {
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
        // alert("Please narrow down search. Defaulting to LeGoat James :)");
        const img = document.querySelector("#headshot");
        img.src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/2544.png`;
        var url = new URL("https://www.balldontlie.io/api/v1/stats");
        var params = {
            'seasons[]': ['2022'], 
            'player_ids[]': [237],
            'per_page': 100
        };
        url.search = new URLSearchParams(params).toString();
        let response = await fetch(url, { method: "GET" });
        data = await response.json();
    }
    console.log(data.data);

    var sorted_data = data.data.sort((a, b) => {
        return new Date(b.game.date) - new Date(a.game.date);
    });
    console.log(team_map);
    var table = "<table class='table'>" +
            "<thead>" +
            "<tr>" +
            "<th>Date</th>" +
            "<th>Game</th>" +
            "<th>Min</th>" +
            "<th>Pts</th>" +
            "<th>Ast</th>" +
            "<th>Reb</th>" +
            "<th>Stl</th>" +
            "<th>Blk</th>" +
            "<th>Tov</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody>";
    
    console.log(stat_literal[stat]);
    const stat_name = stat_literal[stat];
    var stat_map = {};
    for (let d of sorted_data) {
        if (d.min === "00" || d.min === "" || d.min === "0" || d.min === "0:00") {
            table += "<tr>" +
             "<td>" + d.game.date.substring(0,10) + "</td>" +
             "<td> <img src=\"" + team_map[d.game.visitor_team_id].logo + "\" class=\"img-fluid img-max-size\"></img> " 
             + team_map[d.game.visitor_team_id].name + 
             " @ <img src=\"" + team_map[d.game.home_team_id].logo + "\" class=\"img-fluid img-max-size\"></img> " 
             + team_map[d.game.home_team_id].name + "</td>" +
             "<td colspan=\"7\" class=\"text-center\">" + "DNP"+ "</td>" +
             "</tr>";
             continue;
        }
        let stat = d[stat_name];
        if (stat_map[stat]) {
            stat_map[stat]++;
        } else {
            stat_map[stat] = 1;
        }

        table += "<tr>" +
             "<td>" + d.game.date.substring(0,10) + "</td>" +
             "<td> <img src=\"" + team_map[d.game.visitor_team_id].logo + "\" class=\"img-fluid img-max-size\"></img> " 
             + team_map[d.game.visitor_team_id].name + 
             " @ <img src=\"" + team_map[d.game.home_team_id].logo + "\" class=\"img-fluid img-max-size\"></img> " 
             + team_map[d.game.home_team_id].name + "</td>" +
             "<td>" + d.min + "</td>" +
             "<td>" + d.pts + "</td>" +
             "<td>" + d.ast + "</td>" +
             "<td>" + d.reb + "</td>" +
             "<td>" + d.stl + "</td>" +
             "<td>" + d.blk + "</td>" +
             "<td>" + d.turnover + "</td>" +
             "</tr>";
    }

    table += "</tbody>" +
         "</table>";

    document.getElementById("table_container").innerHTML = table;

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