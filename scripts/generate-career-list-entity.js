const path = require('path');
const fs = require('fs');
const xlsx = require('node-xlsx');

const RESOURCES_PATH = path.join(process.cwd(), 'resources');
const SOURCE_XLSX_FILE = path.join(RESOURCES_PATH, 'entrevistas.ods');
const OUTPUT_FILE = path.join(RESOURCES_PATH, 'luis', 'career-list-entity.lu');

const PROGRAMA_COLUMN = 2;
const SINONIMO_COLUMN = 8;

const workSheetsFromFile = xlsx.parse(SOURCE_XLSX_FILE);
const careersInfo = workSheetsFromFile.find(worksheet => worksheet.name === 'Programas - Duración');

/*
$career_list:Contabilidad General=
- contabilidad
$career_list:Técnico Superior en Administración de Empresas=
- tecnico en administración de empresas
$career_list:Diplomado en Pericia Social en Procesos Judiciales de Familia=
- pericia social
*/

let output = '';
careersInfo.data
  .filter((_, index) => index > 0)
  .forEach((row, _) => {
    const synonyms = row[SINONIMO_COLUMN];
    const synonyms_list = synonyms ? synonyms.split(',') : [];

    output += `
$career_list: ${row[PROGRAMA_COLUMN]}=`;

    if (synonyms_list.length) {
      output += `\n- ${synonyms_list.join('\n-')}\n`;
    }
});

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
