import { fetchStats } from './stats.js'
import { fetchPlayer } from './player.js';
import { fetchSeasonAverage } from './team.js';

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
      id: player.personId,
      apiId: player.apiId
    }
  });
  var team_content = Object.entries(team_options).map(([key, value]) => ({ 
    category: 'Team', 
    title: value.name,
    apiId: key,
    id: value.id
  }));

  $('.ui.search').search({
    type: 'category',
    source:  [...player_content, ...team_content],
    onSelect: function(result, response) {
      var currentUrl = window.location.href;
      var indexOfQueryString = currentUrl.indexOf('?');
      var baseUrl = indexOfQueryString !== -1 ? currentUrl.slice(0, indexOfQueryString) : currentUrl;
      var newUrl = baseUrl + `?${result.category.toLowerCase()}=${result.title}&id=${result.id}&apiId=${result.apiId}`;
      window.location.href = newUrl;
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const playerParam = urlParams.get("player");
  const teamParam = urlParams.get("team");
  const idParam = urlParams.get("id");
  const apiIdParam = urlParams.get("apiId");

  if (playerParam) {
    console.log(`The URL has a query parameters 'player=' with value: ${playerParam} and 'id=' with value ${idParam} and 'apiId=' with value ${apiIdParam}`);
    player = await fetchPlayer(apiIdParam);
    generatePlayerPage(idParam);
    document.getElementById("block").style.display = "block";
    
  } else if (teamParam) {
    console.log(`The URL has a query parameter 'team=' with value: ${teamParam} and 'id=' with value ${idParam} and 'apiId=' with value ${apiIdParam}`);
    generateTeamPage(teamParam, idParam, apiIdParam)
    document.getElementById("block").style.display = "block";
  } else {
    console.log("The URL does not have a query parameter 'player=' or 'team='");
    player = await fetchPlayer(237);
    generatePlayerPage(2544);
    document.getElementById("block").style.display = "block";
  }
})();

async function generateTeamPage(team, id, apiId) {
  let player_list;
  const players_res = await fetch("./nba/players.json") //http://data.nba.net/data/10s/prod/v1/2022/players.json
  player_list = await players_res.json();

  const player_team_dict = {};
  player_list['league']['standard'].forEach(player => {
    player_team_dict[player.teamId] = [ ...(player_team_dict[player.teamId] || []), player];
  });
  console.log("Player_team_dict => ", player_team_dict[id]);
  const totals_map = await fetchSeasonAverage(player_team_dict[id]);
  stat_map_global = totals_map;

  const teams_res = await fetch("./nba/teams.json")
  team_map = await teams_res.json();

  const img = document.querySelector("#headshot");
  img.src = team_map[apiId].logo;
  document.body.style.backgroundColor = `rgba(${team_map[apiId].secondary_color}, 0.3)`;
  document.querySelector(".btn").style.backgroundColor = `rgba(${team_map[apiId].secondary_color}, 0.1)`;
  document.querySelector(".ui.input .prompt").style.backgroundColor = `rgba(${team_map[apiId].secondary_color}, 0.1)`;
  document.body.style.visibility = "visible";

  var stat = $('#stat_select').val();
  console.log(stat);
  const data = getSpecificStat(totals_map, stat);
  data.sort((a, b) => b.count - a.count)
  bColors = [];
  intervalLength = 1/data.length
  tran = 1;
  for (let d of data) {
    bColors.push(`rgba(${team_map[apiId].primary_color}, ${tran})`)
    console.log(tran)
    tran -= intervalLength
  }
  chart = new Chart(
    document.getElementById('nba'),
    {
      type: 'doughnut',
      data: {
        labels: data.map(row => row.stat),
        datasets: [
          {
            label: 'Team Totals',
            data: data.map(row => row.count),
            backgroundColor: bColors,
            hoverOffset: 4
          }
        ]
      },
      options: {
          plugins: {
              title: {
                  display: true,
                  text: `${team} ${stat} this Season`
              },
              legend: {
                display: false
              }
          },
          ticks: {
            precision:0
          }
      }
    }
  );
}

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
  console.log(stat, stat_map_global);
  const data = getSpecificStat(stat_map_global, stat);
  if (!player) {
    data.sort((a, b) => b.count - a.count)
  }
  chart.data.labels = data.map(row => row.stat);
  chart.data.datasets[0].data = data.map(row => row.count);

  const words = chart.options.plugins.title.text.split(" ");
  words[words.length - 3] = stat;
  chart.options.plugins.title.text = words.join(" ");

  chart.update();
  return chart;
});
