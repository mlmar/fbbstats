const verify = () => {
  const td = new Date();
  const dy = td.getDay();
  const mn = td.getMinutes() + dy;
  const pw = prompt('');
  if(pw != (mn%2 ? dy+''+mn : mn+''+dy)) {
    throw new Error('!');
  }
}