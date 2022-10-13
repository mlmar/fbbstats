const statsUtil = {
  stats: null,
  averages: {},
  percentiles: {},
  players: {}
}

statsUtil.clean = (text) => text?.toLowerCase().trim().replace(' ','').replace('-','').replace("'",'').replace('.','');

statsUtil.fetchStats = async () => {
  try {
    let res = await fetch(CONFIG.DATA_PATH);
    res = await res.json();
    statsUtil.stats = res.stats;
    statsUtil.cleanStats();
    statsUtil.calculatePercentiles();
    return statsUtil.stats;
  } catch(e) {
    console.error(e);
    alert('Unable to fetch player statistics');
    return null;
  }
}

statsUtil.cleanStats = () => {
  statsUtil.averages = {};
  statsUtil.stats.forEach((player, i) => {
    player.QUERY = statsUtil.clean(player.PLAYER);
    statsUtil.players[player.QUERY] = player;

    CONFIG.CATEGORIES.forEach((cat) => {
      player[cat] = parseFloat(player[cat].replace('%',''));
      statsUtil.averages[cat] = (statsUtil.averages[cat] || 0) + player[cat];
    })
  });

  CONFIG.CATEGORIES.forEach((cat) => {
    statsUtil.averages[cat] /= statsUtil.stats.length;
    statsUtil.averages[cat] = toFixed(statsUtil.averages[cat], 2);
  });
}

statsUtil.calculatePercentiles = () => {
  statsUtil.percentiles = {}
  CONFIG.CATEGORIES.forEach((cat) => {
    const sorted = cat !== 'TOV' ? 
      statsUtil.stats.slice(0).sort((a, b) => (a[cat] - b[cat])) :
      statsUtil.stats.slice(0).sort((b, a) => (a[cat] - b[cat])).reverse() ;

    sorted.forEach((player, i) => {
      statsUtil.percentiles[player.QUERY] = (statsUtil.percentiles[player.QUERY] || {}) 
      statsUtil.percentiles[player.QUERY][cat] = toFixed((i / statsUtil.stats.length) * 100, 2);
    });
  });
  return statsUtil.percentiles;
}

statsUtil.search = (name) => {
  const query = statsUtil.clean(name);
  const results = statsUtil.stats?.filter(p => p.QUERY.includes(query));
  return results;
}

statsUtil.getPlayer = (name) => statsUtil.players[statsUtil.clean(name)];
statsUtil.getPercentiles = (name) => statsUtil.percentiles[statsUtil.clean(name)];

function toFixed(num, fixed) {
  var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
  return parseFloat(num.toString().match(re)[0]);
}