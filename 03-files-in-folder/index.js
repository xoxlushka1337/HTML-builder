const { log } = require('console');
const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

//fsPromises.readdir(path.join(__dirname, 'secret-folder'), {});
const link = path.join(__dirname, 'secret-folder');
fs.readdir(link, { withFileTypes: true }, (error, dirEntryList) => {
  if (!error) {
    dirEntryList.forEach((dirEventry) => {
      if (dirEventry.isFile()) {
        if (path) {
          const arrName = dirEventry.name.split('.');
          const linkFile = path.join(
            __dirname,
            'secret-folder',
            dirEventry.name
          );
          fs.stat(linkFile, (err, stats) => {
            if (err) throw err;
            console.log(
              `${arrName[0]} - ${arrName[1]} - ${stats.size / 1024}kb`
            );
          });
        }
      }
    });
  }
});
