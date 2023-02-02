export async function fetchHeadshot(name) {
    fetch("./nba/players.json", {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(players => {
        for (let player of players['league']['standard']) {
            if (`${player['firstName']} ${player['lastName']}` == name) {
                const img = document.querySelector("#headshot");
                img.src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player['personId']}.png`;
                return player['personId'];
            }
        }
        const img = document.querySelector("#headshot");
        img.src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/2544.png`;
        return 2544;
    });
}
