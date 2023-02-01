export async function fetchPlayer() {
    // Get the current URL
    const currentURL = new URL(document.location.href);
    var paramValue = currentURL.searchParams.get("input");
    console.log(paramValue);

    if (paramValue == null) {
        paramValue = "lebron"
    }

    var url = new URL("https://www.balldontlie.io/api/v1/players");
    var params = {
        'search': paramValue,
        'per_page': 100
    };
    url.search = new URLSearchParams(params).toString();
    let response = await fetch(url, { method: "GET" });
    let data = await response.json();

    if (data.data.length == 0) {
        alert("Couldn't find player!!");
        return {
            "id": 237,
            "first_name": "LeBron",
            "height_feet": 6,
            "height_inches": 8,
            "last_name": "James",
            "position": "F",
            "team": {
              "id": 14,
              "abbreviation": "LAL",
              "city": "Los Angeles",
              "conference": "West",
              "division": "Pacific",
              "full_name": "Los Angeles Lakers",
              "name": "Lakers"
            },
            "weight_pounds": 250
          };
    }
    console.log(data.data);

    for (let d of data['data']) {
        console.log(d);
        if (d['height_inches'] != null) {
            return d;
        } 
    }
    return data.data[0];
}