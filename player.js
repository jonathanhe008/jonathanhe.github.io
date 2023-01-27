export async function fetchPlayer() {
    // Get the current URL
    const currentURL = new URL(document.location.href);
    const paramValue = currentURL.searchParams.get("input");
    console.log(paramValue);

    if (paramValue == null) {
        return null;
    } else {
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
        }
        console.log(data.data);
        return data.data[0];
    }
}