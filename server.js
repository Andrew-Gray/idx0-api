import 'dotenv/config'
import express from 'express'
import * as fs from 'fs';
import mysql from 'mysql2'
import { LoremIpsum } from "lorem-ipsum"
import QRCode from 'qrcode'
import dateFns from 'date-fns'

const port = process.env.PORT || 3000
const server = express()
const connection = mysql.createConnection(process.env.DATABASE_URL)


//PLACEHOLDER
server.get('/tools/placeholder/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send("Please specify a width and height in numbers(/width/height)")
})

server.get('/tools/placeholder/:dimensions', (req, res) => {
  const dimensions = req.params.dimensions
  const xIdx = dimensions.toLowerCase().indexOf("x");
  let width = 0;
  let height = 0;

  if (xIdx <= 0) {
    res.status(400).send('ERROR: Must provide dimensions as height "x" width (ex 100x100)');
    return
  }

  width = dimensions.substring(0, xIdx)
  height = dimensions.substring(xIdx + 1, dimensions.length)

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(getSvg(width, height))
})

server.get('/tools/placeholder/:dimensions/:color', (req, res) => {
  const dimensions = req.params.dimensions
  const color = req.params.color
  const xIdx = dimensions.toLowerCase().indexOf("x");
  let width = 0;
  let height = 0;

  if (xIdx <= 0) {
    res.status(400).send('ERROR: Must provide dimensions as height "x" width (ex 100x100)');
    return
  }

  if (
    color.length !== 3 &&
    color.length !== 6
  ) {
    res.status(400).send('ERROR: Color must be a hex color without "#"');
    return
  }

  if (!isHex(color)) {
    res.status(400).send('ERROR: Non hex value provided. All characters must be between 0-9 and A-F');
    return
  }

  width = dimensions.substring(0, xIdx)
  height = dimensions.substring(xIdx + 1, dimensions.length)

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(getSvg(width, height, color))
})

//LOREM IPSUM
const lorem = new LoremIpsum({
  LoremFormat: "plain",
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

server.get('/tools/loremipsum/words/:count', (req, res) => {
  const count = parseInt(req.params.count)

  if (isNaN(count)) {
    res.status(400).send('ERROR: Value provided must be an integer number (ex 25)');
    return
  }

  res.setHeader('Content-Type', 'text/plain');
  res.send(lorem.generateWords(count))
})

server.get('/tools/loremipsum/sentences/:count', (req, res) => {
  const count = parseInt(req.params.count)

  if (isNaN(count)) {
    res.status(400).send('ERROR: Value provided must be an integer number (ex 25)');
    return
  }

  res.setHeader('Content-Type', 'text/plain');
  res.send(lorem.generateSentences(count))
})

server.get('/tools/loremipsum/paragraphs/:count', (req, res) => {
  const count = parseInt(req.params.count)

  if (isNaN(count)) {
    res.status(400).send('ERROR: Value provided must be an integer number (ex 25)');
    return
  }

  res.setHeader('Content-Type', 'text/plain');
  res.send(lorem.generateParagraphs(count))
})

//RANDOM DATA


//QR CODE
//https://www.npmjs.com/package/qrcode?activeTab=readme#qr-code-options
server.get('/tools/qrcode/img/:text', (req, res) => {
  const text = req.params.text
  const params = {}

  const errorLevel = req.query.errorLevel ? req.query.errorLevel : null
  const margin = req.query.margin ? req.query.margin : null
  const scale = req.query.scale ? req.query.scale : null
  const dark = req.query.dark ? req.query.dark : null
  const light = req.query.light ? req.query.light : null

  if (errorLevel) params["errorCorrectionLevel"] = errorLevel
  if (margin) params["margin"] = margin
  if (scale) params["scale"] = scale
  if (dark) params["dark"] = dark
  if (light) params["light"] = light

  QRCode.toDataURL(text, params)
    .then(img => {
      res.setHeader('Content-Type', 'text/html');
      res.send(`<img src="${img}">`)
    })
    .catch(err => {
      console.error(err)
    })
})

server.get('/tools/qrcode/data/:text', (req, res) => {
  const text = req.params.text
  const params = {}

  const errorLevel = req.query.errorLevel ? req.query.errorLevel : null
  const margin = req.query.margin ? req.query.margin : null
  const scale = req.query.scale ? req.query.scale : null
  const dark = req.query.dark ? req.query.dark : null
  const light = req.query.light ? req.query.light : null

  if (errorLevel) params["errorCorrectionLevel"] = errorLevel
  if (margin) params["margin"] = margin
  if (scale) params["scale"] = scale
  if (dark) params["dark"] = dark
  if (light) params["light"] = light

  QRCode.toDataURL(text, params)
    .then(img => {
      res.setHeader('Content-Type', 'text/plain');
      res.send(`${img}`)
    })
    .catch(err => {
      console.error(err)
    })
})

//PASSWORD/PASSPHRASE GENERATOR
server.get('/tools/password', (req, res) => {
  //Get all queries
  const lengthQuery = req.query.length
  const upperCaseQuery = req.query.upperCase
  const lowerCaseQuery = req.query.lowerCase
  const numberCaseQuery = req.query.numberCase
  const specialCharsQuery = req.query.specialChars

  //Setup vars and char sets
  let passCharSet = [];
  let password = "";
  const upperCaseSet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
  const lowerCaseSet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  const numbersSet = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
  const specialCharsSet = ["!", "@", "#", "$", "%", "^", "&", "*"]

  //Set fallbacks
  let length = !isUndefinedNullOrEmpty(lengthQuery) ? lengthQuery : 16
  const upperCase = !isUndefinedNullOrEmpty(upperCaseQuery) ? upperCaseQuery : "true"
  const lowerCase = !isUndefinedNullOrEmpty(lowerCaseQuery) ? Boolean(lowerCaseQuery) : "true"
  const numbersChars = !isUndefinedNullOrEmpty(numberCaseQuery) ? Boolean(numberCaseQuery) : "true"
  const specialChars = !isUndefinedNullOrEmpty(specialCharsQuery) ? specialCharsQuery : "true"

  //Don't go over 128
  if (length > 128) length = 128

  //Add enabled character sets
  if (upperCase == "true") {
    passCharSet = [...passCharSet, ...upperCaseSet]
  }
  if (lowerCase == "true") {
    passCharSet = [...passCharSet, ...lowerCaseSet]
  }
  if (numbersChars == "true") {
    passCharSet = [...passCharSet, ...numbersSet]
  }
  if (specialChars == "true") {
    passCharSet = [...passCharSet, ...specialCharsSet]
  }

  //Generate passwords
  for (let idx = 1; idx <= length; idx++) {
    const randomCharIdx = getRandomInt(0, passCharSet.length - 1)
    password += passCharSet[randomCharIdx];
  }

  //Set results
  res.setHeader('Content-Type', 'text/plain');
  res.send(`${password}`)
})

server.get('/tools/passphrase', (req, res) => {
  //Get all queries
  const wordCountQuery = req.query.wordCount
  const upperCaseQuery = req.query.upperCase
  const separatorQuery = req.query.separator
  const appendNumberQuery = req.query.appendNumber
  const numberPositionQuery = req.query.numberPosition

  //Set fallbacks
  const wordCount = !isUndefinedNullOrEmpty(wordCountQuery) ? wordCountQuery : 4
  const upperCase = !isUndefinedNullOrEmpty(upperCaseQuery) ? upperCaseQuery : "true"
  const separator = !isUndefinedNullOrEmpty(separatorQuery) ? separatorQuery : "-"
  const appendNumber = !isUndefinedNullOrEmpty(appendNumberQuery) ? appendNumberQuery : "true"
  const numberPosition = !isUndefinedNullOrEmpty(numberPositionQuery) ? numberPositionQuery.toLowerCase() : "end"

  //Setup vars and char sets
  let wordSet = [];
  const wordList = [];

  fs.readFile('wordlist.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      wordSet = data.split(",");

      for (let count = 1; count <= wordCount; count++) {
        const randomWordIdx = getRandomInt(0, wordSet.length - 1)
        let word = wordSet[randomWordIdx]

        if (upperCase == "true") {
          word = capitalizeFirstLetter(word)
        }

        wordList.push(word)
      }

      if (appendNumber == "true") {
        const number = getRandomInt(0, 9)

        if (numberPosition == "end") {
          wordList.push(number)
        } else if (numberPosition == "random") {
          wordList.splice(getRandomInt(0, wordCount - 1), 0, number);
        }
      }

      res.setHeader('Content-Type', 'text/plain');
      res.send(`${wordList.join(separator)}`)
    }
  });
})

//RANDOM NUMBER
/**
 * Get a random number.
 * @param {number} min - Minimum value as Int
 * @param {number} max - Maximum value as Int
 * @returns {number} - random number between min and max as Int
 */
server.get('/tools/randomNumber', (req, res) => {
  //Get all queries
  const minQuery = req.query.min;
  const maxQuery = req.query.max;

  //Set default
  const min = !isUndefinedNullOrEmpty(minQuery) ? parseInt(minQuery) : 1;
  const max = !isUndefinedNullOrEmpty(maxQuery) ? parseInt(maxQuery) : 6;

  //Set results
  const randomNumber = getRandomInt(min, max);
  res.setHeader('Content-Type', 'text/plain');
  res.send(`${randomNumber}`)
})


//DATES
server.get('/tools/date/intervalToDuration', (req, res) => {
  //Get all queries
  const startQuery = req.query.start;
  const endQuery = req.query.end;
  const startDate = dateFns.parseISO(startQuery)
  const EndDate = dateFns.parseISO(endQuery)

  //Fail states
  if (isUndefinedNullOrEmpty(startQuery)) {
    res.status(400).send('ERROR: Start value must be provided');
    return
  }
  if (isUndefinedNullOrEmpty(endQuery)) {
    res.status(400).send('ERROR: End value must be provided');
    return
  }

  if (!dateFns.isValid(startDate)) {
    res.status(400).send('ERROR: Start value must be a valid date');
    return
  }

  if (!dateFns.isValid(EndDate)) {
    res.status(400).send('ERROR: End value must be a valid date');
    return
  }

  //Get and return duration
  const duration = dateFns.intervalToDuration({
    start: startDate,
    end: EndDate
  })

  res.setHeader('Content-Type', 'application/json');
  res.send(`${JSON.stringify(duration)}`)
})

server.get('/tools/date/add', (req, res) => {
  //Get all queries
  const dateQuery = req.query.date
  const daysQuery = req.query.days;
  const weeksQuery = req.query.weeks;
  const monthsQuery = req.query.months;
  const yearsQuery = req.query.years;

  //Error checking
  const useDate = dateFns.parseISO(dateQuery)
  if (isUndefinedNullOrEmpty(dateQuery)) {
    res.status(400).send('ERROR: Date must be provided');
    return
  }
  if (!dateFns.isValid(useDate)) {
    res.status(400).send('ERROR: Date value must be a valid date');
    return
  }

  //Set defaults
  const addDays = !isUndefinedNullOrEmpty(daysQuery) ? parseInt(daysQuery) : 0
  const addWeeks = !isUndefinedNullOrEmpty(weeksQuery) ? parseInt(weeksQuery) : 0
  const addMonths = !isUndefinedNullOrEmpty(monthsQuery) ? parseInt(monthsQuery) : 0
  const addYears = !isUndefinedNullOrEmpty(yearsQuery) ? parseInt(yearsQuery) : 0

  //create new date with additions and send data
  const newDate = dateFns.add(useDate, {
    years: addYears,
    months: addMonths,
    weeks: addWeeks,
    days: addDays
  })

  res.setHeader('Content-Type', 'text/plain');
  res.send(`${dateFns.formatISO(newDate, { representation: 'date' })}`)
})


//File Reading
server.get('/tools/fakeProfile', (req, res) => {
  const ID = getRandomInt(1, 25000);

  const sql = `SELECT * FROM FakeProfile WHERE id = ${ID}`;
  connection.query({ sql }, (err, result, fields) => {
    if (err instanceof Error) {
      console.error(err);
      res.status(500).send(err);
      return;
    }

    const data = result[0];
    data.mothersMaiden = data.mothersMaiden.trim();
    data.color = data.color.replace(/\r/g, "");


    res.setHeader('Content-Type', 'application/json');
    res.send(`${JSON.stringify(data)}`)
  });

})



//SERVER
server.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})


//FUNCTIONS
function isUndefinedNullOrEmpty(data) {
  if (typeof data == "undefined" || data == null || data == "") return true;
  else return false;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function contrastingColor(color) {
  return (luma(color) >= 165) ? '000' : 'fff';
}

function luma(color) {
  // color can be a hx string or an array of RGB values 0-255
  var rgb = (typeof color === 'string') ? hexToRGBArray(color) : color;
  return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
}

function hexToRGBArray(color) {
  if (color.length === 3)
    color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
  else if (color.length !== 6)
    throw ('Invalid hex color: ' + color);
  var rgb = [];
  for (var i = 0; i <= 2; i++)
    rgb[i] = parseInt(color.substr(i * 2, 2), 16);
  return rgb;
}

function isHex(value) {
  return Boolean(value.match(/^[0-9a-f]+$/i))
}

function getSvg(paramWidth, paramHeight, bgColor = "333") {

  const height = paramHeight && paramHeight > 50 ? paramHeight : 50
  const width = paramWidth && paramWidth > 50 ? paramWidth : 50
  const textColor = contrastingColor(bgColor);

  let fontSizeMain = "20px"
  let fontSizeIdx0 = width > 70 ? "11px" : "9px"

  if (width < 200) {
    fontSizeMain = "16px"
  }
  else if (width <= 70) {
    fontSizeMain = "13px"

  }

  return `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      version="1.1"
      width="${width}" 
      height="${height}" 
      style="font: ${fontSizeMain} Verdana, Helvetica, Arial, sans-serif;"
    >
      <rect 
        width="${width}" 
        height="${height}" 
        style="fill: #${bgColor};"
      />
      <text 
        fill="#${textColor}" 
        x="50%" 
        y="50%" 
        dominant-baseline="middle" 
        text-anchor="middle"
      >${width} x ${height}</text>
      <text 
        fill="#${textColor}" 
        x="99%" 
        y="99%" 
        dominant-baseline="auto" 
        text-anchor="end"
        style="font-size: ${fontSizeIdx0};"
      >idx0.ca</text>
    </svg>
  `
}