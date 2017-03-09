'use strict'

const Inky = require('inky').Inky,
    inlineCSS = require('inline-css'),
    validEmail = require('email-validator').validate,
    cheerio = require('cheerio'),
    fs = require('fs'),
    entities = require('entities');

const inky = new Inky(),
    templatesDir = './templates',
    distDir = './dist';

function renderHTML(template) {
    const inkyHtml = cheerio.load(template);
    const stdHtml = inky.releaseTheKraken(inkyHtml);

    return inlineCSS(stdHtml, {
        url: `./`,
        preserveMediaQueries: true,
        applyWidthAttributes: true
    });
}

if (process.argv.length === 3) {
    const templateName = process.argv[2];

    fs.readFile(`${templatesDir}/${templateName}.html`, function(err, content) {
        if (err) {
            throw new Error(err.message);
        }

        renderHTML(content).then(function(html) {
            if (!fs.existsSync(distDir)) {
              fs.mkdirSync(distDir);
            }

            fs.writeFile(`${distDir}/${templateName}.html`, entities.decodeHTML(html), function(error){
                if(err) {
                    return console.log(err);
                }

                console.log(`The file was saved in: ${distDir}/${templateName}.html`);
            });
        }, function(error) {
           throw new Error(error.message);
        });
    });
} else {
    console.log('Wrong number of arguments, please try with something like:\n\t$ node app.js index');
}

