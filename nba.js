import { fetchStats } from "./stats.js";
import { fetchPlayer } from './player.js';

(async function() {
  const player = await fetchPlayer();
  
  const data = await fetchStats(player);
  var name = player ? `${player['first_name']} ${player['last_name']}` : "LeBron James";

  new Chart(
    document.getElementById('nba'),
    {
      type: 'bar',
      data: {
        labels: data.map(row => row.point),
        datasets: [
          {
            label: 'Frequency',
            data: data.map(row => row.count)
          }
        ]
      },
      options: {
          plugins: {
              title: {
                  display: true,
                  text: `${name} Points this Season`
              }
          },
          ticks: {
            precision:0
          }
      }
    }
  );
})();