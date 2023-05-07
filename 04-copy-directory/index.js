const fs = require('fs');
const path = require('path');
const link = path.join(__dirname, 'files');

fs.stat(path.join(__dirname, 'files-copy'), function (err, stats) {
  if (err) {
    console.log('Папка не найдена');
    fs.mkdir(path.join(__dirname, 'files-copy'), (err) => {
      if (err) throw err; // не удалось создать папку
      console.log('Папка успешно создана');
    });
    copyFile();
  } else {
    console.log('Папка найдена');

    fs.readdir(
      path.join(__dirname, 'files-copy'),
      { withFileTypes: true },
      (error, files) => {
        if (!error) {
          files.forEach((file) => {
            fs.unlink(path.join(__dirname, 'files-copy', file.name), (err) => {
              if (err) throw err; // не удалось удалить файл
              console.log('Файл успешно удалён');
            });
          });
        }
      }
    );

    copyFile();
  }
});

function copyFile() {
  fs.readdir(link, { withFileTypes: true }, (error, dirEntryList) => {
    if (!error) {
      dirEntryList.forEach((dirEventry) => {
        fs.copyFile(
          path.join(__dirname, 'files', dirEventry.name),
          path.join(__dirname, 'files-copy', dirEventry.name),
          (err) => {
            if (err) throw err; // не удалось скопировать файл
            console.log('Файл успешно скопирован');
          }
        );
      });
    }
  });
}
