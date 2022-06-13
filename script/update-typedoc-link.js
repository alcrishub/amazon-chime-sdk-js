#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra');

const walk = function (dir) {
  let results = [];
  let list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = dir + '/' + file;
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
};

walk('docs')
  .filter(fn => fn.endsWith('.html'))
  .forEach(file => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) return console.error(err);

      let result = data.replace(/blob\/[0-9a-f]{5,40}\//g, 'blob/main/');

      fs.writeFile(file, result, 'utf8', err => {
        if (err) return console.error(err);
      });
    });
    fs.rename(file, file.toLowerCase());
  });

fs.readFile('docs/assets/search.js', 'utf8', (err, data) => {
  if (err) return console.error(err);

  let result = data.replace(/["][,]["]/g, '",\n"');
  result = result.replace(/[}][,][{]/g, '},\n{');
  fs.writeFile('docs/assets/search.js', result, 'utf8', err => {
    if (err) return console.error(err);
  });
});
