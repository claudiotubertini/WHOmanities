const listItems = [...document.getElementsByTagName('li')];
listItems.map(item => item.style.setProperty('font-weight', 'bold'));

const ul = document.getElementsByTagName('ul')[0];
const newItem = document.createElement('li');
newItem.appendChild(document.createTextNode(`Sto imparando cosa siano le selezioni in D3`));
ul.appendChild(newItem);
