// TEAM SELECTOR
const teamList = ({ parent, id }) => {
  const $el = $$([
    `<div id="${id}" class="team-list flex-col flex-fill overflow-x" tabindex="-1">`,
      `<header class="player flex">
        <label class="flex flex-middle"> PLAYER </label>`,
        CONFIG.CATEGORIES_LABELS.map((cat) =>  `<label class="flex flex-middle"> ${cat} </label>`).join('\n'),
        `<button class="close-btn"></button>`,
      `</header>`,
      `<div id="${id}list" class="list flex-col flex-fill overflow-y"></div>`,
    `</div>`,
  ]);

  const $list = $el.find('#' + id + 'list');
  let $footer = null;
  let _averages = {};
  let _percentiles = {};
  const _playersMap = new Map();

  const getPercentileColors = (percentile, cat) => {
    let colors = ['red', 'orange', 'white', 'yellow', 'green'];
    colors = cat !== 'TOV' ? colors : colors.reverse();
    if(percentile < 40) {
      return colors[0];
    } else if(percentile < 55){
      return colors[1];
    } else if(percentile < 65){
      return colors[2];
    } else if(percentile < 80) {
      return colors[3];
    } else {
      return colors[4];
    }
  }

  const calculateTotals = () => {
    _averages = {
      Query: CONFIG.USER
    }
    _playersMap.forEach((player) => {
      CONFIG.CATEGORIES.forEach((cat) => {
        _averages[cat] = (_averages[cat] || 0) + player[cat];
      });
    });
    CONFIG.CATEGORIES.forEach((cat) => {
      _averages[cat] = toFixed(_averages[cat] / _playersMap.size, 2);
    });
    _percentiles = statsUtil.calculatePercentiles([_averages]);
  }

  const refreshFooter = () => {
    if($footer) {
      $footer.remove();
    }
    calculateTotals();
    $footer = $$([
      `<footer class="player flex">
        <label class="flex flex-middle"> AVERAGES </label>`,
        CONFIG.CATEGORIES.map((cat) =>  `<label class="flex flex-middle"> ${_averages[cat]} </label>`).join('\n'),
        `<button class="close-btn"></button>`,
      `</footer>`,
      `<footer class="player flex percentiles">
        <label class="flex flex-middle"></label>`,
        CONFIG.CATEGORIES.map((cat) =>  `<label class="flex flex-middle ${getPercentileColors(_percentiles[CONFIG.USER][cat], cat)}"> ${_percentiles[CONFIG.USER][cat]} </label>`).join('\n'),
        `<button class="close-btn"></button>`,
      `</footer>`
    ]);
    $el.append($footer);
  }

  const addPlayer = (id) => {
    if(!_playersMap.get(id)) {
      const playerData = statsUtil.getPlayer(id);
      const percentilesData = statsUtil.getPercentiles(id);
      if(playerData) {
        _playersMap.set(id, playerData);
        const $player = $$([
          `<div id="${id}" class="player flex">
            <label class="flex flex-middle"> ${playerData.Player} </label>`,
            CONFIG.CATEGORIES.map((cat) =>  `<label class="flex flex-middle"> ${playerData[cat]} </label>`).join('\n'),
            `<button class="close-btn"> &#10006; </button>`,
          `</div>`,
          `<div id="${id}" class="percentiles player flex">
            <label class="flex flex-middle"></label>`,
            CONFIG.CATEGORIES.map((cat) =>  `<label class="flex flex-middle ${getPercentileColors(percentilesData[cat], cat)}"> ${percentilesData[cat]}% </label>`).join('\n'),
            `<button class="close-btn"></button>`,
          `</div>`
        ]);
        $player.find('button').on('click', () => removePlayer(id));
        $list.append($player);
        refreshFooter();
        save();
      }
    }
  }

  const removePlayer = (id) => {
    _playersMap.delete(id);
    $list.find('#' + id).remove();
    refreshFooter();
    save();
  }

  const save = () => {
    const ids = [];
    _playersMap.forEach((player) => ids.push(player.Query));
    localStorage.setItem('playerIds', ids)
  }

  if(localStorage.getItem('playerIds')) {
    localStorage.getItem('playerIds').split(',').forEach(addPlayer);
  }
  refreshFooter();

  $el.id = id;
  $el.addPlayer = addPlayer;
  $el.removePlayer = removePlayer;
  $(parent).append($el);
  return $el;
}