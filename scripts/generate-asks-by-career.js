const path = require('path');
const fs = require('fs');
const xlsx = require('node-xlsx');

const RESOURCES_PATH = path.join(process.cwd(), 'resources');
const SOURCE_XLSX_FILE = path.join(RESOURCES_PATH, 'entrevistas.ods');
const OUTPUT_FILE = path.join(RESOURCES_PATH, 'qna-maker', 'faq-qna-careers.lu');

// columns
const CATEGORIA_COLUMN = 0;
const ESCUELA_COLUMN = 1;
const PROGRAMA_COLUMN = 2;
const CAREER_METADATA_COLUMN = 3;
const DURACION_COLUMN = 4;
const PERFIL_COLUMN = 5;
const MALLA_COLUMN = 6;
const REQUISITOS_COLUMN = 7;

const workSheetsFromFile = xlsx.parse(SOURCE_XLSX_FILE);
const careersInfo = workSheetsFromFile.find(worksheet => worksheet.name === 'Programas - Duración');

let output = '';
careersInfo.data
  .filter((_, index) => index > 0)
  .forEach((row, _) => {
    let textCareer = row[CATEGORIA_COLUMN] === 'carrera' ? `de la ${row[CATEGORIA_COLUMN]}`: '';

    output += `
## ? ¿Cuál es la duración ${row[PROGRAMA_COLUMN]}?
  - Cuál es la duración ${row[PROGRAMA_COLUMN]}
  - Cual es la duración ${textCareer} para ${row[PROGRAMA_COLUMN]}
  - Cual es la duracion para ${row[PROGRAMA_COLUMN]}
  - Cuánto dura ${row[PROGRAMA_COLUMN]}
  **Filters:**
  - career_category = ${row[CATEGORIA_COLUMN]}
  - career_school = ${row[ESCUELA_COLUMN]}
  - career = ${row[CAREER_METADATA_COLUMN]}
  \`\`\`markdown
  La duración es de ${row[DURACION_COLUMN]}.
  \`\`\`
`;
});

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
