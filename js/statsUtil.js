const statsUtil = {
  stats: null,
  averages: {},
  percentiles: {},
  ranks: {},
  players: {}
}

statsUtil.clean = (text) => text?.toLowerCase().trim().replace(/\s/g, '').replace('-','').replace("'",'').replace('.','').normalize("NFD").replace(/\p{Diacritic}/gu, "");

statsUtil.fetchStats = async () => {
  try {
    let res = await fetch(CONFIG.DATA_PATH);
    res = await res.json();
    statsUtil.stats = res.filter(player => player.G > CONFIG.MIN_GAMES);
    statsUtil.cleanStats();
    const { percentiles, ranks } = statsUtil.getPercentilesAndRanks();
    statsUtil.percentiles = percentiles;
    statsUtil.ranks = ranks;
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
    player.Query = statsUtil.clean(player.Player);
    statsUtil.players[player.Query] = player;

    CONFIG.CATEGORIES.forEach((cat) => {
      player[cat] = parseFloat(player[cat]);
      statsUtil.averages[cat] = (statsUtil.averages[cat] || 0) + player[cat];
    })
  });

  CONFIG.CATEGORIES.forEach((cat) => {
    statsUtil.averages[cat] /= statsUtil.stats.length;
    statsUtil.averages[cat] = toFixed(statsUtil.averages[cat], 2);
  });
}

statsUtil.getPercentilesAndRanks = (data) => {
  let _data = data || [];
  let percentiles = {};
  let ranks = {};
  CONFIG.CATEGORIES.forEach((cat) => {
    const sorted = cat !== 'TOV' ? 
      [...statsUtil.stats, ..._data].sort((a, b) => (a[cat] - b[cat])) :
      [...statsUtil.stats, ..._data].sort((b, a) => (a[cat] - b[cat])).reverse() ;

    sorted.forEach((player, i) => {
      percentiles[player.Query] = (percentiles[player.Query] || {}) 
      percentiles[player.Query][cat] = toFixed((i / statsUtil.stats.length) * 100, 2);
      ranks[player.Query] = (ranks[player.Query] || {});
      ranks[player.Query][cat] = statsUtil.stats.length - i;
    });
  });
  return { percentiles, ranks };
}

statsUtil.search = (name) => {
  const query = statsUtil.clean(name);
  const results = statsUtil.stats?.filter(p => p.Query.includes(query));
  return results;
}

statsUtil.getPlayer = (name) => statsUtil.players[statsUtil.clean(name)];
statsUtil.getPercentiles = (name) => statsUtil.percentiles[statsUtil.clean(name)];
statsUtil.getRanks = (name) => statsUtil.ranks[statsUtil.clean(name)];

function toFixed(num, fixed) {
  var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
  return parseFloat(num.toString().match(re)[0]);
}