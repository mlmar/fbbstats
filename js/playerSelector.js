// PLAYER SELECTOR
const playerSelector = ({ parent, id, onSelect }) => {
  const $el = $$([
    `<div id="${id}" class="player-selector flex-col" tabindex="-1">
      <input id="${id}PlayerNameInput" type="text" placeholder="Player Name"/>
      <div id="${id}Dropdown" class="dropdown flex-col" style="display:none"></div>
      <div id="${id}Focus" tabindex="-1"><div/>
    </div>`
  ]);

  const $input = $el.find('#' + id + 'PlayerNameInput');
  const $dropdown = $el.find('#' + id + 'Dropdown');
  const $focus = $el.find('#' + id + 'Focus');

  let _index = 0;
  let _searchResults = [];

  const search = (val) => {
    _index = 0;
    _searchResults = statsUtil.search(val);
    $dropdown.empty();
    _searchResults.forEach((player, i) => {
      $dropdown.append($$([
        `<button id="${player.Query}" class="flex" data-key="${i}"> ${player.Player} </button>`
      ]));
    });
    if(_searchResults.length) {
      $dropdown.show();
    } else {
      $dropdown.hide();
    }
  }
  search($input.val());
  $dropdown.hide();

  // Search on input
  $input.on('input', () => {
    search($input.val());
  });

  $input.on('keydown', (event) => {
    switch(event.key) {
      case 'ArrowDown':
        if(_searchResults.length) {
          _index = 0;
          hover();
          $focus.trigger('focus');
          $dropdown.show();
        }
        break;
      case 'Enter':
        $input.val('');
        $($dropdown.children()[_index]).trigger('click');
        search($input.val());
        $dropdown.hide();
        break;
    }
  });

  $focus.on('keydown', (event) => {
    switch(event.key) {
      case 'ArrowUp':
        _index -= _index === -1 ? 0 : 1;
        if(_index > -1) {
          hover();
        } else {
          $input.focus();
        }
        break;
      case 'ArrowDown':
        _index += _index === _searchResults.length-1 ? 0 : 1;
        hover();
        break;
      case 'Enter':
        $input.val('');
        $input.focus();
        $($dropdown.children()[_index]).trigger('click');
        search($input.val());
        $dropdown.hide();
        break;
      default:
        $input.val('');
        $input.trigger('focus');
        break;
    }
  });

  $dropdown.on('mouseenter', () => {
    _index = -1;
    $dropdown.children().removeClass('selected');
  });

  const hover = () => {
    $input.val( _searchResults[_index].Player);
    const $player = $($dropdown.children()[_index]);
    $dropdown[0].scrollTo(0, $player[0].offsetTop + $player[0].clientHeight);
  }

  $dropdown.on('click', (event) => {
    let id = event.target.id;
    $input.trigger('focus');
    $input.val('');
    search($input.val());
    if(id && onSelect) onSelect(id);
  });

  // Show dropdown if focused
  $(document).on('click', (event) => {
    let res = $el.find($(event.target));
    if(res?.length) {
      $dropdown.show();
    } else {
      $dropdown.hide();
    }
  });

  $el.id = id;
  $el.input = $input;
  $el.dropdown = $dropdown;
  $(parent).append($el);
  return $el;
}