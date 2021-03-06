'use strict';


module.exports = function (file, options) {
  if (!file) throw new Error('no file(s)');
  return _fileHandler(file, options);
};

let fs = require('fs');
let uuid = require('uuid');

const _fileHandler = function (file, options) {
  if (!file) throw new Error('no file');

  const filenameBase = uuid.v1();
  const fileExtension = file.hapi.filename.split('.').pop();
  const path = `${options.dest}${filenameBase}.${fileExtension}`;
  const fileStream = fs.createWriteStream(path);

  return new Promise((resolve, reject) => {
    file.on('error', function (err) {
      reject(err);
    });

    file.pipe(fileStream);

    file.on('end', function (err) {

      const fileDetails = {
        fieldname: file.hapi.name,
        originalname: file.hapi.filename,
        filename: `${filenameBase}.${fileExtension}`, //just for the response.
        mimetype: file.hapi.headers['content-type'],
        destination: `${options.dest}`,
        path, //path is the actual placement of the file
        size: fs.statSync(path).size,
      };

      resolve(fileDetails);
    })
  })
};