import { fetchStats } from './stats.js'
import { fetchPlayer } from './player.js';
var player = null;
var chart = null;
var team_map = null;
var stat_map_global = null;

(async function generatePage() {
  let player_options;
  const players_res = await fetch("./nba/players.json")
  player_options = await players_res.json();

  let team_options;
  const teams_res = await fetch("./nba/teams.json")
  team_options = await teams_res.json();

  var player_content = player_options['league']['standard'].map(function(player) {
    return {
      category: 'Player',
      title: `${player.firstName} ${player.lastName}`,
      id: player.personId
    }
  });
  var team_content = Object.entries(team_options).map(([key, value]) => ({ 
    category: 'Team', 
    title: value.name,
    id: key
  }));

  $('.ui.search').search({
    type: 'category',
    source:  [...player_content, ...team_content],
    onSelect: function(result, response) {
      var currentUrl = window.location.href;
      var indexOfQueryString = currentUrl.indexOf('?');
      var baseUrl = indexOfQueryString !== -1 ? currentUrl.slice(0, indexOfQueryString) : currentUrl;
      var newUrl = baseUrl + `?${result.category.toLowerCase()}=${result.title}&id=${result.id}`;
      window.location.href = newUrl;
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const playerParam = urlParams.get("player");
  const teamParam = urlParams.get("team");
  const idParam = urlParams.get("id");

  if (playerParam) {
    console.log(`The URL has a query parameters 'player=' with value: ${playerParam} and 'id=' with value ${idParam}`);
    player = await fetchPlayer(playerParam);
    generatePlayerPage(idParam);
    document.getElementById("playerBlock").style.display = "block";
    
  } else if (teamParam) {
    console.log("The URL has a query parameter 'team=' with value: " + teamParam);
    document.body.style.visibility = "visible";
  } else {
    console.log("The URL does not have a query parameter 'player=' or 'team='");
    player = await fetchPlayer("LeBron James");
    generatePlayerPage(2544);
    document.getElementById("playerBlock").style.display = "block";
  }
})();

async function generatePlayerPage(id) {
  const teams_res = await fetch("./nba/teams.json")
  team_map = await teams_res.json();

  const stat_map = await fetchStats(player, team_map);
  stat_map_global = stat_map;

  const img = document.querySelector("#headshot");
  img.src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${id}.png`;
  document.body.style.backgroundColor = `rgba(${team_map[player.team.id].secondary_color}, 0.3)`;
  document.querySelector(".btn").style.backgroundColor = `rgba(${team_map[player.team.id].secondary_color}, 0.1)`;
  document.querySelector(".ui.input .prompt").style.backgroundColor = `rgba(${team_map[player.team.id].secondary_color}, 0.1)`;
  document.body.style.visibility = "visible";

  var stat = $('#stat_select').val();
  const data = getSpecificStat(stat_map, stat);
  chart = new Chart(
    document.getElementById('nba'),
    {
      type: 'bar',
      data: {
        labels: data.map(row => row.stat),
        datasets: [
          {
            label: 'Frequency',
            data: data.map(row => row.count),
            backgroundColor: `rgb(${team_map[player.team.id].primary_color})`,
          }
        ]
      },
      options: {
          plugins: {
              title: {
                  display: true,
                  text: `${player['first_name']} ${player['last_name']} ${stat} this Season`
              }
          },
          ticks: {
            precision:0
          }
      }
    }
  );
}

function getSpecificStat(stat_map, stat) {
  var stat_literal = {
    "Points": "pts",
    "Assists": "ast",
    "Rebounds": "reb",
    "Blocks": "blk",
    "Steals": "stl",
    "Turnovers": "turnover",
  };
  let result = [];
  for (const [key, value] of Object.entries(stat_map[stat_literal[stat]])) {
      result.push({
          stat: key,
          count: value
      })
  }
  console.log("getSpecificStat => ",result);
  return result;
}

$('#stat_select').on('changed.bs.select', async function (e, clickedIndex, isSelected, previousValue) {
  var stat = $('#stat_select').val();
  console.log(stat, stat_map_global, player);
  const data = getSpecificStat(stat_map_global, stat);
  chart.data.labels = data.map(row => row.stat);
  chart.data.datasets[0].data = data.map(row => row.count);
  chart.options.plugins.title.text = `${player['first_name']} ${player['last_name']} ${stat} this Season`;

  chart.update();
  return chart;
});

