const fs = require('fs');
const handlebars = require('handlebars');

const parse = async (template, values) => {
  return new Promise((resolve, reject) => {
    fs.readFile('./views/' + template, (err, data) => {
      if (err) reject(err);
      const template = handlebars.compile(data.toString());
      resolve(template({ data: values }));
    });
  });
};

module.exports = { parse };
