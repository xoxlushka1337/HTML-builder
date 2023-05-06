const fs = require('fs');
const path = require('path');
const process = require('process');

const writeStream = new fs.WriteStream(path.join(__dirname, 'new-text.txt'));

process.stdout.write('Введите текст:');
process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    endInput();
  }
  writeStream.write(data);
});

process.on('SIGINT', endInput);
function endInput() {
  process.stdout.write('Вы завершили ввод текста\n');
  process.exit();
}
