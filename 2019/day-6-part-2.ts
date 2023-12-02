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

  let san, you;
  const nodes = [second];
  while (nodes.length > 0) {
    const curr = nodes.pop();

    // get instructions for next orbiters
    const orbiters = input
      .filter(el => el.startsWith(curr.name))
      .map(i => i.split(')')[1])
      .forEach(n => {
        const node = curr.addChild(n);
        if (n == 'SAN') san = node;
        if (n == 'YOU') you = node;
        nodes.push(node);
      });
  }

  // lowest common ancestor that you and san both orbit
  const ancestors = []
  let oiss = [com];
  while (oiss.length > 0) {
    const curr = oiss.pop();

    if(curr.find("YOU") && curr.find("SAN")) {
      ancestors.push(curr);
    }
    curr.orbitedBy.slice().forEach(n => oiss.push(n));
  }
  
  const lca = ancestors.sort((a,b)=> a.totalOrbits < b.totalOrbits ? 1 : -1 )[0]

  const distance = you.totalOrbits + san.totalOrbits - 2*lca.totalOrbits - 2
  console.log('result: ', distance)
  return distance
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

    let res = false;
    while (nodes.length > 0) {
      const curr = nodes.pop();
      if (curr.name == tgt) {
        res = true;
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
