export async function fetchPlayer(player) {
    var url = new URL("https://www.balldontlie.io/api/v1/players");
    var params = {
        'search': player,
        'per_page': 100
    };
    url.search = new URLSearchParams(params).toString();
    let response = await fetch(url, { method: "GET" });
    let data = await response.json();

    console.log("fetchPlayer => ", data.data);

    for (let d of data['data']) {
        console.log(d);
        if (d['height_inches'] != null) {
            return d;
        } 
    }
    return data.data[0];
    
}