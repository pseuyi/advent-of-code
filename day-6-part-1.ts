var fs = require('fs');

fs.readFile('input.txt', function(err, data) {
  if (err) throw err;

  // text array
  const text = data
    .toString()
    .split('\n')
    .filter(s => s.length > 0);

  totalOrbits(text.slice());
});

const totalOrbits = input => {
  // create an object in space out of the first orbit pair
  const [comName, comChild] = input.find(el => el.startsWith('COM')).split(')');
  console.log(comName + ')' + comChild);

  const com = new OIS(comName, 0);

  const second = com.addChild(comChild);

  const nodes = [second];
  while (nodes.length > 0) {
    const curr = nodes.pop() 

    // get instructions for next orbiters
    const orbiters = input
      .filter(el => el.startsWith(curr.name))
      .map(i => i.split(')')[1])
      .forEach(n => {
        nodes.push(curr.addChild(n));
      });
  }

  console.log('final count: ', count(com));
};

function OIS(name, totalOrbits) {
  this.name = name;
  this.orbitedBy = [];
  this.totalOrbits = totalOrbits;

  this.addChild = name => {
    const child = new OIS(name, this.totalOrbits + 1);
    this.orbitedBy.push(child);
    return child;
  };

  this.find = tgt => {
    const nodes = this.orbitedBy.slice();

    let res;
    while (nodes.length > 0) {
      const curr = nodes.pop();
      if (curr.name == tgt) {
        res = curr;
        break;
      } else {
        curr.orbitedBy.slice().forEach(n => nodes.push(n));
      }
    }

    return res;
  };
}

const count = com => {
  const nodes = com.orbitedBy.slice();

  let res = 0;

  while (nodes.length > 0) {
    const curr = nodes.pop();
    res += curr.totalOrbits;
    curr.orbitedBy.slice().forEach(n => nodes.push(n));
  }

  return res;
};
