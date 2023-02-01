export async function fetchTeams() {
    // var url = new URL("https://www.balldontlie.io/api/v1/teams");
    // let response = await fetch(url, { method: "GET" });
    // let data = await response.json();

    // let team_map = {};
    // for (let d of data.data) {
    //     team_map[d.id] = d.full_name
    // }
    // console.log(team_map);
    // return team_map;

    fetch("./teams.json", {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(teams => {
        return teams;
    });
    
}