const li = d3.selectAll('li').style('font-weight', 'bold');

const ul = d3.select('ul');
ul.append('li').text(`I'm learning about selections`);
const ul = d3.select('ul');
ul.select('li').style('color', 'red');
ul.append('li').text(`I'm learning about selections`);
