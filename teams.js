export function fetchTeams() {
    fetch("./teams.json", {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(teams => {
        console.log(teams);
        return teams;
    });
    
}