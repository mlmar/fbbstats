const CONFIG = {
  DATA_PATH: 'https://raw.githubusercontent.com/mlmar/fbbstats/master/data/players-2021.json',
  CATEGORIES: ['FGP', 'FTP', 'TGM', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TOV'],
  CATEGORIES_LABELS: ['FG%', 'FT%', '3PTM', 'PTS', 'REB', 'AST', 'ST', 'BLK', 'TO'],
  MAX_PLAYERS: 150
}

const $$ = (htmlArr) => $(htmlArr.join('\n'));