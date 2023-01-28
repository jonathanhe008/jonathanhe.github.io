import { fetchStats } from "./stats.js";
import { fetchPlayer } from './player.js';
import { fetchHeadshot } from './headshot.js';

(async function() {
  const player = await fetchPlayer();
  var name = player ? `${player['first_name']} ${player['last_name']}` : "LeBron James";
  const id = await fetchHeadshot(name);
  const data = await fetchStats(player);

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