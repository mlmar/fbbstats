const CONFIG = {
  DATA_PATH: 'https://raw.githubusercontent.com/mlmar/fbbstats/master/data/players-2022.json',
  CATEGORIES: ['FG%', 'FT%', '3P', 'PTS', 'TRB', 'AST', 'STL', 'BLK', 'TOV'],
  CATEGORIES_LABELS: ['FG%', 'FT%', '3PTM', 'PTS', 'REB', 'AST', 'ST', 'BLK', 'TO'],
  MAX_PLAYERS: 300,
  MIN_GAMES: 0,
  USER: 'USER'
}

const $$ = (htmlArr) => $(htmlArr.join('\n'));