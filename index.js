/*** INITIALIZATION ***/
let _stats = null;
let $main = null;
let $playerSelector = null;
let $teamList = null;

$(document).ready(() => {
  init();
});

const init = async () => {
  _stats = await statsUtil.fetchStats();
  $main = $('#main');
  
  $playerSelector = playerSelector({
    parent: $main, 
    id: 'playerSelector', 
    onSelect: handlePlayerSelect
  });

  let $container = $(`<div class="flex-col flex-fill overflow-x"></div>`)
  $teamList = teamList({
    parent: $container,
    id: 'teamList',
    onSelect: handleTeamSelect
  });
  $main.append($container);
}

const handlePlayerSelect = (id) => {
  $teamList.addPlayer(id);
}

const handleTeamSelect = (id) => {
}