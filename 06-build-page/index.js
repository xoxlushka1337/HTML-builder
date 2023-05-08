const { log } = require('console');
const fs = require('fs');
const path = require('path');
const sourceFolder = path.join(__dirname, 'assets');
const targetFolder = path.join(__dirname, 'project-dist', 'assets');

fs.stat(path.join(__dirname, 'project-dist'), function (err, stats) {
  if (err) {
    console.log('Папка не найдена');
    fs.mkdir(path.join(__dirname, 'project-dist'), (err) => {
      if (err) throw err; // не удалось создать папку
      console.log('Папка успешно создана project-dist');
    });
    fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), (err) => {
      if (err) throw err; // не удалось создать папку s
      console.log('Папка успешно создана assets');
    });
    copyFolderRecursiveAsync(sourceFolder, targetFolder);
  } else {
    console.log('Папка найдена');

    copyFolderRecursiveAsync(sourceFolder, targetFolder);
  }
});

async function copyFolderRecursiveAsync(source, target) {
  if ((await fs.promises.stat(source)).isDirectory()) {
    const files = await fs.promises.readdir(source);
    for (const file of files) {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      if ((await fs.promises.stat(curSource)).isDirectory()) {
        fs.stat(curTarget, function (err, stats) {
          if (err) {
            fs.mkdir(curTarget, (err) => {
              if (err) throw err; // не удалось создать папку f
              console.log('Папка успешно создана ДОП');
            });
          } else {
            console.log('Файл найден');
          }
        });

        copyFolderRecursiveAsync(curSource, curTarget);
      } else {
        fs.promises.copyFile(curSource, curTarget);
      }
    }
  }
}

const newFile = fs.createWriteStream(
  path.join(__dirname, 'project-dist/style.css')
);
// const newFileHtml = fs.createWriteStream(
//   path.join(__dirname, 'project-dist/index.html')
// );

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
              newFile.write(data.toString() + '\n');
            });
          }
        }
      });
    }
  }
);

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

// читаем файл

// fs.readFile(
//   path.join(__dirname, 'template.html'),
//   'utf8',
//   function (error, data) {
//     newFileHtml.write(data);
//   }
// );

async function x() {
  const files = await fs.promises.readdir(path.join(__dirname, 'components'), {
    withFileTypes: true,
  });

  console.log(files);

  let indexData = await fs.promises.readFile(
    path.join(__dirname, 'project-dist/index.html'),
    'utf-8'
  );

  files.forEach((file) => {
    if (file.isFile()) {
      if (path.extname(file.name) === '.html') {
        const replaceTag = `{{${file.name.split('.')[0]}}}`;

        fs.readFile(
          path.join(__dirname, 'components', file.name),
          'utf-8',
          (err, text) => {
            indexData = indexData.replace(replaceTag, text);
            console.log(indexData);
            fs.writeFile(
              path.join(__dirname, 'project-dist/index.html'),
              indexData,
              (error) => console.log('Done!')
            );
          }
        );
      }
    }
  });

  // fs.readFile(
  //   path.join(__dirname, 'project-dist/index.html'),
  //   function (err, data) {
  //     if (err) throw err;
  //     data = decoder.write(data); // конвектируем в строку
  //     console.log(data);
  //     fs.readdir(
  //       path.join(__dirname, 'components'),
  //       { withFileTypes: true },
  //       (error, files) => {
  //         if (!error) {
  //           files.forEach((file) => {
  //             if (file.isFile()) {
  //               if (path.extname(file.name) === '.html') {
  //                 const nameFile = `{{${file.name.split('.')[0]}}}`;

  //                 fs.readFile(
  //                   path.join(__dirname, 'components', file.name),
  //                   'utf8',
  //                   function (error, text) {
  //                     data = data.replace(nameFile, text);
  //                   }
  //                 );
  //               }
  //             }
  //           });
  //         }
  //       }
  //     );
  //   }
  // );
}
// x();
// async function readFile(path) {
//   const result = await fs.promises.readFile(
//     '/mnt/c/Users/xoxlushka1337/Projects/HTML-builder/06-build-page/components/articles.html',
//     'utf8'
//   );

//   return result;
// }

// console.log();
