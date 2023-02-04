export async function fetchPlayer(apiId) {
    var url = new URL(`https://www.balldontlie.io/api/v1/players/${apiId}`);
    let response = await fetch(url, { method: "GET" });
    let data = await response.json();

    console.log("fetchPlayer => ", data);

    return data;
}