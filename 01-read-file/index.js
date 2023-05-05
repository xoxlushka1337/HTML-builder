const fs = require('fs');
const path = require('path');

const readStream = new fs.ReadStream(path.join(__dirname, 'text.txt'));

readStream.on('data', (chunk) => {
  console.log(chunk.toString());
});
