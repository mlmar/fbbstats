// TEAM SELECTOR
const teamList = ({ parent, id }) => {
  const $el = $$([
    `<div id="${id}" class="team-list flex-col" tabindex="-1">`,
      `<header class="player flex">
        <label class="flex flex-middle"> PLAYER </label>`,
        CONFIG.CATEGORIES_LABELS.map((cat) =>  `<label class="flex flex-middle"> ${cat} </label>`).join('\n'),
        `<button class="close-btn"></button>`,
      `</header>`,
    `</div>`,
  ]);

  const playersMap = new Map();

  const getPercentileColors = (percentile, cat) => {
    let colors = ['red', 'orange', 'yellow', 'green'];
    colors = cat !== 'TOV' ? colors : colors.reverse();
    if(percentile < 50) {
      return colors[0];
    } else if(percentile < 70){
      return colors[1];
    } else if(percentile < 85){
      return colors[2];
    } else {
      return colors[3];
    }
  }

  const addPlayer = (id) => {
    if(!playersMap.get(id)) {
      const playerData = statsUtil.getPlayer(id);
      const percentilesData = statsUtil.getPercentiles(id);
      if(playerData) {
        playersMap.set(id, playerData);
        const $player = $$([
          `<div id="${id}" class="player flex">
            <label class="flex flex-middle"> ${playerData.PLAYER} </label>`,
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
        $el.append($player);
        save();
      }
    }
  }

  const removePlayer = (id) => {
    playersMap.delete(id);
    $el.find('#' + id).remove();
    save();
  }

  const save = () => {
    const ids = [];
    playersMap.forEach(({ QUERY }) => ids.push(QUERY));
    localStorage.setItem('playerIds', ids)
  }

  if(localStorage.getItem('playerIds')) {
    localStorage.getItem('playerIds').split(',').forEach(addPlayer);
  }

  $el.id = id;
  $el.addPlayer = addPlayer;
  $el.removePlayer = removePlayer;
  $(parent).append($el);
  return $el;
}