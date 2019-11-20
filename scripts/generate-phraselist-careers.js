const path = require('path');
const fs = require('fs');
const xlsx = require('node-xlsx');

const RESOURCES_PATH = path.join(process.cwd(), 'resources');
const SOURCE_XLSX_FILE = path.join(RESOURCES_PATH, 'entrevistas.ods');
const OUTPUT_FILE = path.join(RESOURCES_PATH, 'luis', 'phraselist-careers.lu');

const PROGRAMA_COLUMN = 2;
const PHRASE_LIST_COLUMN = 8;

const workSheetsFromFile = xlsx.parse(SOURCE_XLSX_FILE);
const careersInfo = workSheetsFromFile.find(worksheet => worksheet.name === 'Programas - Duración');

// $career: PhraseList interchangeable
//   - Contabilidad General, Contador Auditor, Programa de Continuidad en Contador Auditor

let output = '';
let careers = [];
output += '$career:PhraseList interchangeable \n\  - ';
 careersInfo.data
  .filter((_, index) => index > 0)
  .forEach((row, _) =>  {
    careers.push(row[PROGRAMA_COLUMN]);

    if (row[PHRASE_LIST_COLUMN]) {
      careers.push(row[PHRASE_LIST_COLUMN]);
    }
  });

output += careers.join(', ');
fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
