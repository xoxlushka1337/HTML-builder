const { log } = require('console');
const fs = require('fs');
const path = require('path');

async function exists(path) {
  try {
    await fs.promises.access(path);
    return true;
  } catch (e) {
    return false;
  }
}

async function createDirectory(path) {
  const directoryExists = await exists(path);
  if (!directoryExists) {
    await fs.promises.mkdir(path);
  }
}

async function copyFile(from, to) {
  await fs.promises.copyFile(from, to);
}

async function readFile(path) {
  return await fs.promises.readFile(path, 'utf8');
}

async function readDir(path) {
  return fs.promises.readdir(path);
}

async function writeFile(path, content) {
  await fs.promises.writeFile(path, content);
}

async function createFile(path, content) {
  await writeFile(path, content);
}

async function copyFolderRecursive(source, target) {
  if ((await fs.promises.stat(source)).isDirectory()) {
    const files = await fs.promises.readdir(source);
    for (const file of files) {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      if ((await fs.promises.stat(curSource)).isDirectory()) {
        createDirectory(curTarget);
        console.log('Папка успешно создана ДОП');
        copyFolderRecursive(curSource, curTarget);
      } else {
        copyFile(curSource, curTarget);
      }
    }
  }
}

async function init() {
  await createDirectory(path.join(__dirname, 'project-dist'));
  await createDirectory(path.join(__dirname, 'project-dist', 'assets'));
  await copyFolderRecursive(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets')
  );

  const readStyle = await readDir(path.join(__dirname, 'styles'));
  let resultCss = '';
  for (file of readStyle) {
    if (path.extname(file) === '.css') {
      const textFileStyle = await readFile(
        path.join(__dirname, 'styles', file)
      );
      resultCss += textFileStyle + '\n\n';
    }
  }
  await createFile(path.join(__dirname, 'project-dist/style.css'), resultCss);

  await copyFile(
    path.join(__dirname, 'template.html'),
    path.join(__dirname, 'project-dist/index.html')
  );

  let readFileHtml = await readFile(
    path.join(__dirname, 'project-dist/index.html')
  );

  const componentsHtml = await readDir(path.join(__dirname, 'components'));
  for (const component of componentsHtml) {
    if (path.extname(component) === '.html') {
      const componentText = await readFile(
        path.join(__dirname, 'components', component)
      );

      readFileHtml = readFileHtml.replace(
        `{{${component.split('.')[0]}}}`,
        componentText
      );
    }
  }
  await writeFile(
    path.join(__dirname, 'project-dist/index.html'),
    readFileHtml
  );
}
init();
