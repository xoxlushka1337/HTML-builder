const fs = require('fs');
const path = require('path');
const newFileCss = fs.createWriteStream(
  path.join(__dirname, 'project-dist/bundle.css')
);

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (error, files) => {
    if (!error) {
      files.forEach((file) => {
        if (file.isFile()) {
          const fileName = path.basename(
            path.join(__dirname, 'styles', file.name)
          );
          if (path.extname(file.name) === '.css') {
            const arr = fs.createReadStream(
              path.join(__dirname, 'styles', fileName)
            );
            arr.on('data', (data) => {
              newFileCss.write(data.toString() + '\n');
            });
          }
        }
      });
    }
  }
);
